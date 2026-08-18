/**
 * GATE 1 - the package declares no --sc- token of its own.
 *
 * Ruling: _decisions/2026-08-18_smartcity_kit_component_package.md, item 1 as
 * amended 2026-08-18: the package may CARRY the canonical token block; what it
 * may not do is INVENT a token.
 *
 * Four parts, because one assertion cannot cover both halves of that sentence.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { ROOT, authoredFiles, lf, readLf, upstream } from "./_lib.mjs";

const TOKEN_DECL = /--sc-[\w-]*\s*:/;

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const declarationLines = (css) =>
  stripComments(css)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/**
 * This file is excluded from its own scan, and that exclusion is the whole
 * reason it is stated here: gate 1c has to quote the pinned token line in order
 * to pin it, so the detector necessarily carries its own needle. Exactly one
 * file is excluded, by name, and nothing else is.
 */
const SELF = "test/gate1-tokens.test.mjs";

test("gate 1a: no authored file declares a --sc- token", () => {
  const offenders = authoredFiles()
    .filter((p) => p !== SELF)
    .filter((p) => TOKEN_DECL.test(readLf(join(ROOT, p))));
  assert.deepEqual(
    offenders,
    [],
    `these authored files declare a --sc- token, which is a fork of the design system: ${offenders.join(", ")}`,
  );
});

test("gate 1b: --sc- declarations exist only in registered vendor copies, each matching its pin", () => {
  const manifest = upstream();
  const registered = new Map(manifest.sources.map((s) => [s.file, s]));

  /* Which registered files declare a token at all. Measured, not assumed. */
  const declaring = manifest.sources
    .filter((s) => TOKEN_DECL.test(readLf(join(ROOT, s.file))))
    .map((s) => s.file)
    .sort();

  assert.deepEqual(
    declaring,
    ["vendor/30b-section-4.1.css", "vendor/sc-kit.css"],
    "the set of token-declaring files changed",
  );

  for (const file of declaring) {
    const source = registered.get(file);
    const text = readLf(join(ROOT, file));
    const sha = createHash("sha256").update(text).digest("hex");
    assert.equal(
      sha,
      source.sha256,
      `${file} no longer matches its pinned upstream hash (counting rule: sha256 over CRLF-normalized utf8)`,
    );
    assert.equal(Buffer.byteLength(text), source.bytes, `${file} byte count changed`);
  }
});

/**
 * The pre-registered delta between the shipped kit file and 30b section 4.1.
 *
 * This is a measurement taken 2026-08-18 and pinned, not an allowance. With CSS
 * comments stripped, smartcity-dashboards web/sc-kit.css differs from the doc
 * extract by exactly ONE declaration line: the Compass spring constants, which
 * 30b section 1.7 names in prose as stiffness 320, damping 32, mass 0.9. Every
 * token value is otherwise identical.
 *
 * Reported to the planner as finding F-1. The kit is not the place to reconcile
 * the doc against the product, but it is the right place to notice if the gap
 * ever widens.
 */
const PINNED_ADDED_LINES = [
  "--sc-spring-stiffness:320; --sc-spring-damping:32; --sc-spring-mass:0.9;",
];

test("gate 1c: the carried token block differs from 30b section 4.1 only by the pinned delta", () => {
  const kit = declarationLines(readLf(join(ROOT, "vendor/sc-kit.css")));
  const spec = declarationLines(readLf(join(ROOT, "vendor/30b-section-4.1.css")));

  const specSet = new Set(spec);
  const added = kit.filter((l) => !specSet.has(l));
  assert.deepEqual(
    added,
    PINNED_ADDED_LINES,
    "vendor/sc-kit.css declares token-block content that 30b section 4.1 does not, beyond the pinned delta",
  );

  const kitSet = new Set(kit);
  const dropped = spec.filter((l) => !kitSet.has(l));
  assert.deepEqual(
    dropped,
    [],
    "vendor/sc-kit.css drops lines the canonical 30b section 4.1 block declares",
  );
});

test("gate 1d: the built dist carries the same token file, unmodified", () => {
  const distCss = join(ROOT, "dist/sc-kit.css");
  assert.ok(existsSync(distCss), "dist/sc-kit.css is missing; run the build");
  assert.equal(
    lf(readFileSync(distCss, "utf8")),
    readLf(join(ROOT, "vendor/sc-kit.css")),
    "the build modified the token file on its way into dist",
  );
});
