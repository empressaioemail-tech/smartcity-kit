/**
 * Acquire the two typefaces the design system declares.
 *
 * Run by hand, never by the build: the build must work offline and must produce
 * the same bytes on every machine, so the network step is separated from it and
 * its result is committed. This script writes fonts/files/*.woff2, the two
 * licence texts, and fonts/FONTS.json, which is the only place a shipped font
 * file is registered.
 *
 *   node scripts/fetch-fonts.mjs
 *
 * WHAT IS FETCHED IS NOT A CHOICE MADE HERE. The set of families and weights is
 * read out of vendor/index.html, the registered copy of the product's own page,
 * because the product's font URL is the authoritative statement of what the
 * product loads. Adding a weight is an upstream edit followed by
 * `npm run refresh:vendor` and a re-run of this script; it is not an edit here.
 *
 * The files are Google Fonts' subsetted builds of two SIL Open Font License
 * families, taken from the exact URLs the product's own page resolves to. The
 * licence that accompanies those binaries is fetched with them.
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { productFontUrl, requestedFaces } from "./fonts-css.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FONT_DIR = join(ROOT, "fonts");
const FILE_DIR = join(FONT_DIR, "files");

/** A browser UA, because the font host serves ttf to anything it does not recognise. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

/**
 * The licence text that accompanies each family's binaries, taken from the
 * repository that publishes them rather than from the upstream design project,
 * so the text shipped is the one covering these exact files.
 */
const LICENCES = [
  {
    family: "Inter",
    file: "OFL-Inter.txt",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt",
    project: "https://github.com/rsms/inter",
  },
  {
    family: "IBM Plex Mono",
    file: "OFL-IBMPlexMono.txt",
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/OFL.txt",
    project: "https://github.com/IBM/plex",
  },
];

async function get(url, asText) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return asText ? await res.text() : Buffer.from(await res.arrayBuffer());
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseFaces(css) {
  const faces = [];
  const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([\s\S]*?)\}/g;
  for (const m of css.matchAll(re)) {
    const subset = m[1];
    const body = m[2];
    const pick = (name) => {
      const v = new RegExp(`${name}:\s*([^;]+);`).exec(body);
      return v ? v[1].trim() : null;
    };
    faces.push({
      family: pick("font-family").replace(/^['"]|['"]$/g, ""),
      style: pick("font-style"),
      weight: Number(pick("font-weight")),
      subset,
      unicodeRange: pick("unicode-range"),
      sourceUrl: /url\(([^)]+)\)/.exec(pick("src"))[1].replace(/^['"]|['"]$/g, ""),
    });
  }
  return faces;
}

const html = readFileSync(join(ROOT, "vendor/index.html"), "utf8");
const cssUrl = productFontUrl(html);
const asked = requestedFaces(cssUrl);
console.log(`the product requests: ${asked.map((a) => `${a.family} ${a.weight}`).join(", ")}`);

const css = await get(cssUrl, true);
const faces = parseFaces(css);
if (faces.length === 0) throw new Error("no @font-face blocks parsed from the font host response");

/* Report what IS: every requested face must be present in the response. */
for (const a of asked) {
  const n = faces.filter((f) => f.family === a.family && f.weight === a.weight).length;
  if (n === 0) throw new Error(`the font host returned nothing for ${a.family} ${a.weight}`);
  console.log(`  ${a.family} ${a.weight}: ${n} subset files`);
}

rmSync(FILE_DIR, { recursive: true, force: true });
mkdirSync(FILE_DIR, { recursive: true });

const records = [];
for (const f of faces) {
  const name = `${slug(f.family)}-${f.subset}-${f.weight}-${f.style}.woff2`;
  const bytes = await get(f.sourceUrl, false);
  writeFileSync(join(FILE_DIR, name), bytes);
  records.push({
    family: f.family,
    style: f.style,
    weight: f.weight,
    subset: f.subset,
    unicodeRange: f.unicodeRange,
    file: `fonts/files/${name}`,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    sourceUrl: f.sourceUrl,
  });
}

const licences = [];
for (const l of LICENCES) {
  /* Written and hashed LF-normalized. .gitattributes pins eol=lf, so a CRLF the
     host happens to send would be rewritten on the next checkout and the pin
     would stop matching the file it pins. The binaries are hashed raw; only text
     is normalized, and both rules are stated in the manifest. */
  const text = (await get(l.url, true)).replace(/\r\n/g, "\n");
  writeFileSync(join(FONT_DIR, l.file), text);
  licences.push({ ...l, sha256: createHash("sha256").update(text).digest("hex"), bytes: Buffer.byteLength(text) });
}

records.sort((a, b) => a.file.localeCompare(b.file));

writeFileSync(
  join(FONT_DIR, "FONTS.json"),
  JSON.stringify(
    {
      note:
        "Every file in fonts/ is a COPY. Nothing here is authored by @empressaio/smartcity-kit. Refresh with `node scripts/fetch-fonts.mjs`, never by hand.",
      countingRule:
        "Two rules, because there are two kinds of file. A font file's sha256 and byte count are over the RAW BINARY: a woff2 is not text and .gitattributes marks it binary, so nothing rewrites it. A licence text's sha256 and byte count are over CRLF-NORMALIZED utf8, because .gitattributes pins eol=lf and a hash taken over CRLF would stop matching its own file at the next checkout.",
      capturedOn: new Date().toISOString().slice(0, 10),
      requestedBy: {
        file: "vendor/index.html",
        note:
          "The families and weights below are the ones the product's own page asks the font host for. This file is the single source of truth for that set; the gate reads it, so a weight added upstream fails here rather than drifting silently.",
        url: cssUrl,
      },
      licence: {
        id: "OFL-1.1",
        note:
          "Both families are SIL Open Font License 1.1, which permits redistribution when the licence accompanies the files. Each text is shipped beside the binaries it covers. This is the fonts' own licence and says nothing about the licence of this package.",
        texts: licences,
      },
      faces: records,
    },
    null,
    2,
  ) + "\n",
);

const total = records.reduce((n, r) => n + r.bytes, 0);
console.log(`wrote ${records.length} font files (${(total / 1024).toFixed(0)} KiB) and ${licences.length} licence texts`);
