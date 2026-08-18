/**
 * GATE 2 - no component file contains a hex color, an rgb() value, or a
 * hardcoded px radius or duration.
 *
 * Ruling item 2. The scan is over raw file bytes INCLUDING comments, and that
 * is deliberate: an exclusion for comments needs a comment stripper, and a
 * comment stripper is one template literal away from being wrong. The exclusion
 * set for this instrument is therefore empty, and the cost is that a comment may
 * not spell a value either. That cost is worth an instrument with no seams.
 */
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { ROOT, componentFiles, readLf } from "./_lib.mjs";

const FORBIDDEN = [
  { id: "hex-colour", re: /#[0-9a-fA-F]{3,8}\b/g, says: "a colour lives in a token, never in a component" },
  { id: "rgb", re: /\brgba?\s*\(/g, says: "a colour lives in a token, never in a component" },
  { id: "px-length", re: /\b\d+(\.\d+)?px\b/g, says: "a radius, size or spacing value lives in a token" },
  { id: "ms-duration", re: /\b\d+(\.\d+)?ms\b/g, says: "a duration lives in a token" },
  { id: "s-duration", re: /\b\d+(\.\d+)?s\b(?!\w)/g, says: "a duration lives in a token" },
];

test("gate 2: no component file carries a colour, a radius, a size or a duration", () => {
  const hits = [];
  for (const file of componentFiles()) {
    const text = readLf(join(ROOT, file));
    for (const rule of FORBIDDEN) {
      for (const m of text.matchAll(rule.re)) {
        const line = text.slice(0, m.index).split("\n").length;
        hits.push(`${file}:${line} ${rule.id} "${m[0]}" - ${rule.says}`);
      }
    }
  }
  assert.deepEqual(hits, [], `component files carry hardcoded values:\n${hits.join("\n")}`);
});

test("gate 2: the scan actually covers every component file", () => {
  const files = componentFiles();
  assert.ok(files.length >= 8, `expected the src tree, found ${files.length} files`);
  assert.ok(files.every((f) => f.startsWith("src/")), "componentFiles drifted outside src/");
});
