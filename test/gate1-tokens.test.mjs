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
 * This is a measurement, pinned, not an allowance. It is stated in BOTH
 * directions as EXACT line arrays rather than as a filter, so a NEW divergence
 * still turns this red in either direction; a filter would have quietly
 * absorbed the next one.
 *
 * WHAT THE DELTA IS AND WHY IT IS THIS SIZE.
 *
 * Taken 2026-08-18 it was ONE line: the Compass spring constants, which 30b
 * section 1.7 names in prose as stiffness 320, damping 32, mass 0.9. Every token
 * value was otherwise identical, and that was reported to the planner as finding
 * F-1.
 *
 * It is now eight added and seven dropped, and every one of the extra rows is
 * the SAME cause: two accessibility passes raised token values in the product
 * while 30b section 4.1 still declares the originals.
 *   G-94 raised --sc-ink-3 and --sc-quiet in both themes (light #6C7E8E ->
 *   #576672, dark #7B8B99 -> #8594A1) to clear WCAG AA.
 *   G-98 raised the light --sc-ok (#2F7A52 -> #2E7750), which measured 4.444:1
 *   on --sc-ok-wash #E3F0E8 against the 4.5:1 floor that applies to the kit's
 *   12px/500 pill text; it is 4.623:1 after. The dark --sc-ok was measured and
 *   did not move.
 * The dark palette is declared TWICE in the token file - once under
 * @media (prefers-color-scheme: dark) and once under :root[data-theme="dark"],
 * .sc-dark - so each dark line appears twice in these arrays. That duplication
 * is the file's real shape, not an error in the pin.
 *
 * THE DOC EXTRACT IS NOT HAND-EDITED TO CLOSE THIS. vendor/30b-section-4.1.css
 * is a copy of doc_repo 30b_smartcity_design_system.md section 4.1, and editing
 * the copy would make this repo assert a doc_repo state that doc_repo does not
 * have. The reconciliation is a planner-owned edit to 30b in both .md and .html,
 * after which the extract is re-vendored and this pin narrows back to one line.
 */
const PINNED_ADDED_LINES = [
  "--sc-ink:#101820; --sc-ink-2:#46586A; --sc-ink-3:#576672;",
  "--sc-ok:#2E7750;         --sc-ok-wash:#E3F0E8;",
  "--sc-quiet:#576672;      --sc-quiet-wash:#E9EEF2;",
  "--sc-ink:#E6EDF3; --sc-ink-2:#A2B2C0; --sc-ink-3:#8594A1;",
  "--sc-quiet:#8594A1;      --sc-quiet-wash:rgba(123,139,153,.14);",
  "--sc-ink:#E6EDF3; --sc-ink-2:#A2B2C0; --sc-ink-3:#8594A1;",
  "--sc-quiet:#8594A1;      --sc-quiet-wash:rgba(123,139,153,.14);",
  "--sc-spring-stiffness:320; --sc-spring-damping:32; --sc-spring-mass:0.9;",
];

const PINNED_DROPPED_LINES = [
  "--sc-ink:#101820; --sc-ink-2:#46586A; --sc-ink-3:#6C7E8E;",
  "--sc-ok:#2F7A52;         --sc-ok-wash:#E3F0E8;",
  "--sc-quiet:#6C7E8E;      --sc-quiet-wash:#E9EEF2;",
  "--sc-ink:#E6EDF3; --sc-ink-2:#A2B2C0; --sc-ink-3:#7B8B99;",
  "--sc-quiet:#7B8B99;      --sc-quiet-wash:rgba(123,139,153,.14);",
  "--sc-ink:#E6EDF3; --sc-ink-2:#A2B2C0; --sc-ink-3:#7B8B99;",
  "--sc-quiet:#7B8B99;      --sc-quiet-wash:rgba(123,139,153,.14);",
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
    PINNED_DROPPED_LINES,
    "vendor/sc-kit.css drops lines the canonical 30b section 4.1 block declares, beyond the pinned delta",
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
