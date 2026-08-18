/**
 * The consumer path.
 *
 * Everything else in this suite imports ../dist/index.mjs by relative path,
 * which is not what a consumer does. A consumer installs a tarball and imports
 * the package NAME, which routes through the exports map, the files list, and
 * the declaration aliases. Every one of those can be wrong while the relative
 * import is fine, so this test packs the package and installs it.
 *
 * It is offline on purpose: the tarball is extracted into a temporary consumer
 * tree and react is linked from this repo, so nothing here depends on a registry
 * being reachable.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { ROOT } from "./_lib.mjs";
import { extractTarGz, readTarGz } from "./_tar.mjs";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

/**
 * `shell: true` is required for npm on Windows and is WRONG for everything else:
 * it re-parses the command line, so a node binary under "C:\Program Files" is
 * split at the space. The two cases are therefore two functions.
 */
function run(cmd, args, cwd) {
  return execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function runNpm(args, cwd) {
  return execFileSync(npm, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  });
}

/**
 * A path handed to npm needs quoting on Windows, where the call goes through a
 * shell, and must NOT be quoted anywhere else, where the quotes arrive as part
 * of the filename. Written out because the two-platform difference is exactly
 * the class of thing a Windows-only local run cannot see: this failed on Linux
 * CI after passing locally.
 */
const npmPath = (p) => (process.platform === "win32" ? JSON.stringify(p) : p);

let consumer;
let packed;

test("consumer: the package packs", () => {
  consumer = mkdtempSync(join(tmpdir(), "sc-kit-consumer-"));
  const out = runNpm(["pack", "--pack-destination", npmPath(consumer)], ROOT);
  const name = out.trim().split("\n").pop().trim();
  packed = join(consumer, name);
  assert.ok(existsSync(packed), `npm pack did not produce ${packed}`);
});

test("consumer: the tarball carries dist and nothing else", () => {
  const listing = readTarGz(readFileSync(packed))
    .map((e) => e.name.replace(/^package\//, ""))
    .filter(Boolean);

  const unexpected = listing.filter(
    (f) =>
      !f.startsWith("dist/") &&
      f !== "package.json" &&
      f !== "README.md" &&
      f !== "LICENSE" &&
      f !== "" &&
      f !== "dist",
  );
  assert.deepEqual(unexpected, [], `the tarball carries files it should not: ${unexpected.join(", ")}`);

  for (const required of ["dist/index.mjs", "dist/index.cjs", "dist/index.d.ts", "dist/sc-kit.css", "dist/shell.css"]) {
    assert.ok(listing.includes(required), `the tarball is missing ${required}`);
  }

  /* Reference copies must never reach a consumer. */
  for (const never of ["vendor/index.html", "vendor/app.js", "vendor/30b-section-4.1.css", "examples/gallery.tsx"]) {
    assert.ok(!listing.includes(never), `${never} is reference only and must not be published`);
  }
});

test("consumer: an installed package imports as ESM and renders", () => {
  const pkgDir = join(consumer, "node_modules", "@empressaio", "smartcity-kit");
  mkdirSync(pkgDir, { recursive: true });
  extractTarGz(readFileSync(packed), pkgDir);

  /* react and react-dom come from this repo so the check needs no network. */
  for (const dep of ["react", "react-dom", "scheduler"]) {
    const from = join(ROOT, "node_modules", dep);
    if (existsSync(from)) cpSync(from, join(consumer, "node_modules", dep), { recursive: true });
  }

  writeFileSync(join(consumer, "package.json"), JSON.stringify({ name: "consumer", type: "module", private: true }));
  writeFileSync(
    join(consumer, "esm.mjs"),
    [
      'import { renderToStaticMarkup } from "react-dom/server";',
      'import * as React from "react";',
      'import { Pill, Panel, Metric } from "@empressaio/smartcity-kit";',
      'const html = renderToStaticMarkup(React.createElement(Pill, null, "Empty"));',
      'if (html !== \'<span class="pill p-quiet">Empty</span>\') { throw new Error("ESM render wrong: " + html); }',
      'if (typeof Panel !== "function" || typeof Metric !== "function") { throw new Error("missing exports"); }',
      'console.log("ESM OK");',
    ].join("\n"),
  );
  const out = run(process.execPath, ["esm.mjs"], consumer);
  assert.match(out, /ESM OK/);
});

test("consumer: the CommonJS build requires and renders", () => {
  writeFileSync(
    join(consumer, "cjs.cjs"),
    [
      'const { renderToStaticMarkup } = require("react-dom/server");',
      'const React = require("react");',
      'const kit = require("@empressaio/smartcity-kit");',
      'const html = renderToStaticMarkup(React.createElement(kit.Pill, null, "Empty"));',
      'if (html !== \'<span class="pill p-quiet">Empty</span>\') { throw new Error("CJS render wrong: " + html); }',
      'console.log("CJS OK", Object.keys(kit).length);',
    ].join("\n"),
  );
  const out = run(process.execPath, ["cjs.cjs"], consumer);
  assert.match(out, /CJS OK/);
});

test("consumer: the stylesheets resolve through the exports map", () => {
  writeFileSync(
    join(consumer, "css.mjs"),
    [
      'import { createRequire } from "node:module";',
      'const kit = createRequire(import.meta.url);',
      'const a = kit.resolve("@empressaio/smartcity-kit/sc-kit.css");',
      'const b = kit.resolve("@empressaio/smartcity-kit/shell.css");',
      'console.log("CSS OK", a.endsWith("sc-kit.css") && b.endsWith("shell.css"));',
    ].join("\n"),
  );
  const out = run(process.execPath, ["css.mjs"], consumer);
  assert.match(out, /CSS OK true/);
});

test("consumer: the emitted types typecheck against a consumer TSX file", () => {
  const tsDir = join(consumer, "ts");
  mkdirSync(tsDir, { recursive: true });
  cpSync(join(ROOT, "node_modules", "typescript"), join(consumer, "node_modules", "typescript"), { recursive: true });
  cpSync(join(ROOT, "node_modules", "@types"), join(consumer, "node_modules", "@types"), { recursive: true });
  cpSync(join(ROOT, "node_modules", "csstype"), join(consumer, "node_modules", "csstype"), { recursive: true });

  writeFileSync(
    join(tsDir, "use.tsx"),
    [
      'import * as React from "react";',
      'import { Metric, Panel, Pill, State, Text } from "@empressaio/smartcity-kit";',
      "export function Screen() {",
      "  return (",
      "    <Panel>",
      '      <Pill meaning="warn">Awaiting applicant</Pill>',
      '      <Metric label="Overdue" value={3} note="of 14 generated cases in flight" />',
      '      <Metric label="Meetings this week" unread="Not read" note="No clerk source" />',
      '      <State kicker="Pipeline unread" heading="Nothing yet." basis="no adapter granted" />',
      '      <Text step="data">48021:34137</Text>',
      "    </Panel>",
      "  );",
      "}",
    ].join("\n"),
  );
  writeFileSync(
    join(tsDir, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022", "DOM"],
        module: "ESNext",
        moduleResolution: "Bundler",
        jsx: "react-jsx",
        strict: true,
        noEmit: true,
        skipLibCheck: true,
      },
      include: ["use.tsx"],
    }),
  );
  const out = run(process.execPath, [join(consumer, "node_modules/typescript/bin/tsc"), "-p", join(tsDir, "tsconfig.json")], consumer);
  assert.equal(out.trim(), "", `consumer typecheck reported errors:\n${out}`);
});

/**
 * The type-level gates, proven by watching the compiler REJECT the shapes the
 * design law forbids. A type that is never tested against a bad program is a
 * comment.
 */
const MUST_NOT_COMPILE = [
  {
    id: "className escape hatch",
    body: '<Pill className="my-pill">Empty</Pill>',
  },
  {
    id: "inline style escape hatch",
    body: "<Pill style={{ color: \"red\" }}>Empty</Pill>",
  },
  {
    id: "a Metric with no counting rule",
    body: '<Metric label="Overdue" value={3} />',
  },
  {
    id: "a Metric that is both a value and an unknown",
    body: '<Metric label="Overdue" value={3} unread="Not read" note="x" />',
  },
  {
    id: "an absence with no basis",
    body: '<State kicker="Pipeline unread" heading="Nothing yet." />',
  },
  {
    id: "a type step outside the ramp",
    body: '<Text step="title">Overview</Text>',
  },
  {
    id: "a Panel with an elevation",
    body: "<Panel elevation={2} />",
  },
  {
    id: "a Pill with an emphasis lever",
    body: '<Pill meaning="ok" emphasis="strong">Ready to issue</Pill>',
  },
  {
    id: "a provenance chip with no source",
    body: "<Prov detail=\"unread\" />",
  },
  {
    id: "an environment badge with no environment",
    body: "<EnvBadge>Demo</EnvBadge>",
  },
];

test("consumer: the compiler rejects every shape the design law forbids", () => {
  const tsDir = join(consumer, "ts");
  const results = [];
  for (const [i, c] of MUST_NOT_COMPILE.entries()) {
    const file = join(tsDir, `reject${i}.tsx`);
    writeFileSync(
      file,
      [
        'import * as React from "react";',
        'import { EnvBadge, Metric, Panel, Pill, Prov, State, Text } from "@empressaio/smartcity-kit";',
        `export const bad = ${c.body};`,
      ].join("\n"),
    );
    writeFileSync(
      join(tsDir, `reject${i}.tsconfig.json`),
      readFileSync(join(tsDir, "tsconfig.json"), "utf8").replace('"use.tsx"', `"reject${i}.tsx"`),
    );
    let rejected = false;
    let why = "";
    try {
      run(process.execPath, [join(consumer, "node_modules/typescript/bin/tsc"), "-p", join(tsDir, `reject${i}.tsconfig.json`)], consumer);
    } catch (err) {
      why = String(err.stdout || "");
      /* The rejection must be ABOUT the offending line. A compiler failing for
         an unrelated reason would otherwise score as a passing gate, which is
         the defect class this program hunts. */
      rejected = why.includes(`reject${i}.tsx(3,`);
    }
    rmSync(file, { force: true });
    results.push({ id: c.id, rejected, why: why.split(String.fromCharCode(10))[0] });
  }
  const accepted = results.filter((r) => !r.rejected).map((r) => `${r.id} (${r.why || "compiled clean"})`);
  assert.deepEqual(
    accepted,
    [],
    ["the compiler did not reject these on the offending line:", ...accepted].join(String.fromCharCode(10)),
  );
});

test("consumer: cleanup", () => {
  if (consumer) rmSync(consumer, { recursive: true, force: true });
  for (const f of readdirSync(ROOT)) {
    if (f.startsWith("empressaio-smartcity-kit-") && f.endsWith(".tgz")) rmSync(join(ROOT, f), { force: true });
  }
});
