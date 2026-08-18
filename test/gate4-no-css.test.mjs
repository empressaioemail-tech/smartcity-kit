/**
 * GATE 4 - the package adds no CSS rule of its own. It ships the kit and
 * renders its classes.
 *
 * Ruling item 4, as amended. The strongest form of "adds no CSS rule" is not a
 * lint on stylesheets the package writes; it is that the package writes none.
 * So: every .css file anywhere in this repo must be a registered copy of an
 * upstream file and must still match it. An authored stylesheet fails this gate
 * by existing, and there is no place to put one where the check does not look.
 *
 * The second half closes the other doors: a styling escape hatch inside a
 * component is a CSS rule wearing a JavaScript costume.
 */
import { createHash } from "node:crypto";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { ROOT, componentFiles, readLf, rel, upstream, walk } from "./_lib.mjs";

test("gate 4: every stylesheet in the repo is a registered, unmodified upstream copy", () => {
  const manifest = upstream();
  const registered = new Map(manifest.sources.map((s) => [s.file, s]));

  const stylesheets = walk(ROOT)
    .map(rel)
    .filter((p) => p.endsWith(".css"))
    .sort();

  /* dist copies are produced by the build from a registered vendor file. */
  const distCopies = new Map([
    ["dist/sc-kit.css", "vendor/sc-kit.css"],
    ["dist/shell.css", "vendor/shell.css"],
  ]);

  const unexplained = [];
  for (const file of stylesheets) {
    const text = readLf(join(ROOT, file));
    if (registered.has(file)) {
      const source = registered.get(file);
      const sha = createHash("sha256").update(text).digest("hex");
      assert.equal(sha, source.sha256, `${file} no longer matches its pinned upstream`);
      continue;
    }
    if (distCopies.has(file)) {
      assert.equal(
        text,
        readLf(join(ROOT, distCopies.get(file))),
        `${file} is not a byte copy of ${distCopies.get(file)}`,
      );
      continue;
    }
    unexplained.push(file);
  }

  assert.deepEqual(
    unexplained,
    [],
    `these stylesheets are authored by this package rather than copied, which forks the design system: ${unexplained.join(", ")}`,
  );
});

test("gate 4: no component carries a styling escape hatch", () => {
  const hatches = [
    { id: "style-element", re: /<style[\s>]/ },
    /* The css-tagged-template needle excludes a preceding dot, because a doc
       comment naming the file sc-kit.css followed by a backtick is not css-in-js.
       Watched firing on a real styled-components call before it was trusted. */
    { id: "css-in-js", re: /\bstyled\s*[.(]|(?<![\w.])css`|\bemotion\b|\bcreateStyles\b/ },
    { id: "inline-style-prop", re: /\bstyle=\{/ },
    { id: "className-prop-passthrough", re: /className\s*[:?]\s*string/ },
    { id: "stylesheet-import", re: /import\s+["'][^"']+\.css["']/ },
    { id: "insertRule", re: /\binsertRule\b|\badoptedStyleSheets\b/ },
  ];
  const hits = [];
  for (const file of componentFiles()) {
    const text = readLf(join(ROOT, file));
    for (const h of hatches) if (h.re.test(text)) hits.push(`${file}: ${h.id}`);
  }
  assert.deepEqual(hits, [], `styling escape hatches found:\n${hits.join("\n")}`);
});

test("gate 4: the public prop types remove className and style", () => {
  /* The type-level half. base.ts is where the two escape hatches are removed;
     if that Omit is ever loosened this fails, and test/types-reject asserts the
     compiler actually rejects them. */
  const base = readLf(join(ROOT, "src/base.ts"));
  assert.match(base, /"className"\s*\|\s*"style"\s*\|\s*"dangerouslySetInnerHTML"/);
});
