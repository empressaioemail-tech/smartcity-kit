/**
 * Proves the typefaces LOAD.
 *
 * A stylesheet that parses is not a font that loaded. Every other check in this
 * repo reads text: that the rules are @font-face, that the families are named by
 * a token, that the files exist and match their hashes. All of those pass on a
 * package whose fonts a browser silently refuses, which is the exact shape of
 * the defect this card fixes — the product's CSS named two families, everything
 * about it looked right, and the type ramp was gone.
 *
 * So this one runs a browser. It serves dist/ over a local http server, renders
 * a page that uses both token stacks, and asserts two independent things:
 *
 *   document.fonts   the browser reports every family and weight as loaded
 *   measured metrics the same string in the same size is a DIFFERENT width from
 *                    the same stack with the shipped families removed, which is
 *                    what a viewer would have got before this change
 *
 * The first can be satisfied by a face that loaded and is never used; the second
 * can be satisfied by coincidence. Together they are hard to fake.
 *
 * Exit-bounded and leaves nothing running: the server binds an ephemeral port,
 * Chrome runs once with a virtual-time budget and a timeout, and the server is
 * closed in a finally.
 *
 *   node scripts/prove-fonts.mjs            uses the first Chrome it finds
 *   CHROME_PATH=... node scripts/prove-fonts.mjs
 */
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { promisify } from "node:util";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tokenFamilies } from "../test/_fonts.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const OUT = join(ROOT, "harness/out");

const CHROMES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const chrome = CHROMES.find((p) => existsSync(p));
if (!chrome) {
  /* An unrun check and a passing check must never look the same. */
  console.error(`no Chrome found. Looked in:\n  ${CHROMES.join("\n  ")}\nSet CHROME_PATH.`);
  process.exit(1);
}

for (const required of ["fonts.css", "kit.css", "sc-kit.css"]) {
  if (!existsSync(join(DIST, required))) {
    console.error(`dist/${required} is missing. Run npm run build first.`);
    process.exit(1);
  }
}

const { stacks } = tokenFamilies(readFileSync(join(ROOT, "vendor/sc-kit.css"), "utf8"));
const probes = stacks.filter((s) => s.primary);
if (probes.length === 0) {
  console.error("no font token names a family first, so there is nothing to prove");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(ROOT, "fonts/FONTS.json"), "utf8"));
const wanted = [...new Set(manifest.faces.map((f) => `${f.weight}|${f.family}`))]
  .map((k) => ({ weight: Number(k.split("|")[0]), family: k.split("|").slice(1).join("|") }))
  .sort((a, b) => a.family.localeCompare(b.family) || a.weight - b.weight);

/**
 * The control stack: the token's own stack with exactly the families this
 * package ships removed, every system face kept. That is what a viewer got
 * before this change, which is the thing the measurement has to be different
 * from. Removing every quoted family instead would compare against a generic
 * stack nobody was ever served.
 */
const shipped = new Set(manifest.faces.map((f) => f.family.toLowerCase()));
const control = (entries) => entries.filter((e) => !shipped.has(e.replace(/^['"]|['"]$/g, "").toLowerCase())).join(", ");

/**
 * The probe string carries letters whose widths differ most between a
 * proportional face and a fallback, plus digits, because the mono stack's job in
 * this system is identifiers. 100px so a small per-glyph difference is not lost
 * in rounding.
 */
const PROBE = "Overdue 48021 MMMiiilll WWWjjj 0123456789 permit case";

const page = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<title>font load proof</title>
<link rel="stylesheet" href="/kit.css" />
<link rel="stylesheet" href="/fonts.css" />
<style>
  body { margin: 0; padding: 16px; }
  .probe { display: inline-block; white-space: pre; font-size: 100px; line-height: 1.2; font-weight: 400; }
  #result { font-size: 12px; word-break: break-all; }
${probes
  .map(
    (p, i) => `  #live${i} { font-family: ${p.value}; }\n  #fallback${i} { font-family: ${control(p.entries)}; }`,
  )
  .join("\n")}
</style>
</head>
<body>
${probes
  .map(
    (p, i) => `
  <div><span class="probe" id="live${i}">${PROBE}</span></div>
  <div><span class="probe" id="fallback${i}">${PROBE}</span></div>`,
  )
  .join("")}
<pre id="result">PENDING</pre>
<script>
(async () => {
  const wanted = ${JSON.stringify(wanted)};
  const probes = ${JSON.stringify(probes.map((p) => ({ token: p.token, primary: p.primary, value: p.value, fallbackStack: control(p.entries) })))};
  const out = { faces: [], probes: [], declared: 0, loaded: 0, error: null };
  try {
    /* Ask for each face explicitly: a face nothing uses is never fetched. */
    await Promise.all(wanted.map((w) => document.fonts.load(w.weight + ' 100px "' + w.family + '"', ${JSON.stringify(PROBE)})));
    await document.fonts.ready;

    /**
     * The real signal is the FontFaceSet, not check().
     *
     * document.fonts.check() returns true for a family the page never declared,
     * because an undeclared family is treated as a system font that is
     * trivially available. Measured here: with every Inter rule removed it went
     * on reporting Inter as loaded for all four weights. It is reported below as
     * a diagnostic and is asserted on nothing.
     *
     * A FontFace entry exists only because an @font-face rule declared it, and
     * reaches status "loaded" only when its file was fetched and parsed. Per
     * family and weight, at least one entry must be loaded; the rest stay
     * unloaded because unicode-range means a browser fetches only the slices the
     * text needs, which is the intended behaviour and not an absence.
     */
    const seen = {};
    document.fonts.forEach((f) => {
      out.declared += 1;
      if (f.status === "loaded") out.loaded += 1;
      const key = f.family.replace(/["']/g, "") + "|" + f.weight;
      seen[key] = seen[key] || { declared: 0, loaded: 0 };
      seen[key].declared += 1;
      if (f.status === "loaded") seen[key].loaded += 1;
    });

    for (const w of wanted) {
      const entry = seen[w.family + "|" + w.weight] || { declared: 0, loaded: 0 };
      out.faces.push({
        family: w.family,
        weight: w.weight,
        declared: entry.declared,
        loaded: entry.loaded,
        check: document.fonts.check(w.weight + ' 100px "' + w.family + '"', ${JSON.stringify(PROBE)}),
      });
    }

    probes.forEach((p, i) => {
      const liveEl = document.getElementById("live" + i);
      const fallbackEl = document.getElementById("fallback" + i);
      const live = liveEl.getBoundingClientRect();
      const fallback = fallbackEl.getBoundingClientRect();
      out.probes.push({
        token: p.token,
        family: p.primary,
        stack: p.value,
        fallbackStack: p.fallbackStack,
        /* The computed values are reported because the first version of this
           page set font-family in a style ATTRIBUTE, whose value carries double
           quotes, so the attribute terminated early and both probes silently
           inherited the body font. Two probes then measured identically and the
           check passed on a measurement of the wrong font. */
        computedFamily: getComputedStyle(liveEl).fontFamily,
        computedSize: getComputedStyle(liveEl).fontSize,
        fallbackComputedFamily: getComputedStyle(fallbackEl).fontFamily,
        liveWidth: Math.round(live.width * 100) / 100,
        fallbackWidth: Math.round(fallback.width * 100) / 100,
        liveHeight: Math.round(live.height * 100) / 100,
        fallbackHeight: Math.round(fallback.height * 100) / 100,
      });
    });
  } catch (err) {
    out.error = String(err && err.message ? err.message : err);
  }
  document.getElementById("result").textContent = "RESULT:" + btoa(JSON.stringify(out));
})();
</script>
</body>
</html>
`;

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "fonts-proof.html"), page);

const MIME = {
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const served = [];
const server = createServer((req, res) => {
  const path = decodeURIComponent((req.url || "/").split("?")[0]);
  served.push(path);
  if (path === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(page);
    return;
  }
  const file = normalize(join(DIST, path));
  if (!file.startsWith(DIST) || !existsSync(file)) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});

let code = 1;
const profile = mkdtempSync(join(tmpdir(), "sc-kit-fonts-"));
try {
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const port = server.address().port;

  /**
   * Asynchronous on purpose, and this is not a style choice. The static server
   * runs in THIS process, so a synchronous child blocks the event loop and the
   * page's own requests can never be answered: Chrome then waits out its whole
   * timeout with an empty page. Cost real time to find.
   */
  const { stdout: dom } = await promisify(execFile)(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      `--user-data-dir=${profile}`,
      "--virtual-time-budget=8000",
      "--dump-dom",
      `http://127.0.0.1:${port}/`,
    ],
    { encoding: "utf8", timeout: 120000, stdio: ["ignore", "pipe", "pipe"] },
  );

  const marker = /RESULT:([A-Za-z0-9+/=]+)/.exec(dom);
  if (!marker) {
    console.error("the page never reported a result. document.fonts was not reached.");
    console.error(dom.slice(0, 1200));
    process.exit(1);
  }
  const result = JSON.parse(Buffer.from(marker[1], "base64").toString("utf8"));

  const failures = [];
  if (result.error) failures.push(`the page threw: ${result.error}`);

  console.log(`Chrome: ${chrome}`);
  console.log(`faces declared to the browser: ${result.declared}, reported loaded: ${result.loaded}`);
  console.log(`font files actually requested over http: ${served.filter((p) => p.endsWith(".woff2")).length}`);

  if (result.declared !== manifest.faces.length) {
    failures.push(`the browser saw ${result.declared} faces; the package registers ${manifest.faces.length}`);
  }
  if (result.loaded === 0) failures.push("the browser loaded no face at all");

  console.log("\nfamily / weight              FontFace entries          check()");
  for (const f of result.faces) {
    console.log(
      `  ${(f.family + " " + f.weight).padEnd(28)} ${String(f.loaded).padStart(2)} loaded of ${String(f.declared).padStart(2)} declared   ${f.check ? "true" : "false"}`,
    );
    if (f.declared === 0) failures.push(`${f.family} ${f.weight} is declared by no @font-face rule`);
    else if (f.loaded === 0) failures.push(`${f.family} ${f.weight} declared ${f.declared} faces and the browser loaded none of them`);
  }
  console.log("  check() is a diagnostic only: it returns true for a family no rule declares.");

  console.log(`\nmeasured metrics, same ${PROBE.length}-character string at 100px`);
  for (const p of result.probes) {
    const delta = Math.round((p.liveWidth - p.fallbackWidth) * 100) / 100;
    console.log(`  ${p.token} (${p.family}) computed ${p.computedSize} ${p.computedFamily}`);
    console.log(`    shipped stack   ${p.liveWidth}px wide, ${p.liveHeight}px tall`);
    console.log(`    system fallback ${p.fallbackWidth}px wide, ${p.fallbackHeight}px tall   [${p.fallbackStack}]`);
    console.log(`    difference      ${delta}px`);

    /* The style has to have applied to the element being measured. */
    const applied = p.computedFamily.replace(/["']/g, "").split(",")[0].trim().toLowerCase();
    if (applied !== p.family.toLowerCase()) {
      failures.push(`${p.token} measured an element whose computed family starts with "${applied}", not ${p.family}`);
    }
    /**
     * The control must not NAME the shipped family, matched as a whole entry.
     * A near-name that survives, such as an alias a designer may have installed
     * locally, is deliberately left in: it is what the stack really falls back
     * to, and if it happens to be present the width check fails loudly rather
     * than passing on a coincidence.
     */
    const controlNames = p.fallbackComputedFamily.split(",").map((e) => e.replace(/["']/g, "").trim().toLowerCase());
    if (controlNames.includes(p.family.toLowerCase())) {
      failures.push(`${p.token}'s control still names ${p.family}, so it is not a control`);
    }
    if (p.liveWidth === p.fallbackWidth && p.liveHeight === p.fallbackHeight) {
      failures.push(
        `${p.token} measures identically with and without the shipped family, so nothing proves the browser used it`,
      );
    }
  }

  /* Two different typefaces must not measure identically. This is the assertion
     that would have caught the attribute-quoting defect above, which made both
     probes measure the same font while every other check passed. */
  const widths = result.probes.map((p) => p.liveWidth);
  if (new Set(widths).size !== widths.length) {
    failures.push(`two token stacks measured the same width (${widths.join(", ")}), so at least one is not rendering in its own face`);
  }

  if (failures.length > 0) {
    console.error(`\nFAILED:\n  ${failures.join("\n  ")}`);
  } else {
    console.log("\nboth families loaded and both measurably changed the rendering.");
    code = 0;
  }
} finally {
  server.close();
  /* Chrome can still hold its profile directory open on Windows for a moment
     after it exits. Failing to delete a temp directory is not a failure of the
     proof, and must not be able to mask its result. */
  try {
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch (err) {
    console.log(`(left ${profile} behind: ${err.code})`);
  }
}

process.exit(code);
