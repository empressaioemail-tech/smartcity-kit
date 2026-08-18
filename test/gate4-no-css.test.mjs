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
 *
 * THE BOUNDED EXCEPTION, amended into the ruling 2026-08-18: the package may
 * ship @font-face rules, and ONLY those, for families the canonical token block
 * already names in its font tokens. The exception exists because the shipped CSS
 * named two families the package did not carry, so every design built from it
 * rendered in a system fallback and lost the type ramp with nothing saying so.
 *
 * An exception that is not measured widens. The five tests at the bottom of this
 * file are what keep it narrow, and each is watched failing against a real
 * injected violation by scripts/prove-gates.mjs:
 *
 *   only @font-face      any other rule, or any byte outside a rule, fails
 *   named families       a family no font token names is a fork
 *   files that ship      every src url must resolve to a file in dist/
 *   nothing unpinned     every shipped file matches its manifest hash
 *   the inverse          a family the tokens name FIRST must have a face, which
 *                        is the original defect stated as an assertion
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, sep } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { productFontUrl, requestedFaces } from "../scripts/fonts-css.mjs";
import { ROOT, componentFiles, nestedClonesSkipped, readLf, rel, toolOutputSkipped, upstream, walk } from "./_lib.mjs";
import { fontFaceRules, tokenFamilies } from "./_fonts.mjs";

const FONT_SHEET = "dist/fonts.css";
const fontManifest = () => JSON.parse(readLf(join(ROOT, "fonts/FONTS.json")));

test("the repo-wide scans state what they refused to walk", () => {
  /* An empty result is not an absence. If a foreign repository is checked out
     inside this one, every repo-wide scan here would otherwise report that
     repo's files as this package's violations, which is what happened on the
     first CI run. The skip is deliberate and is reported rather than hidden. */
  walk(ROOT);
  const tools = toolOutputSkipped();
  if (tools.length > 0) {
    console.log(`tool output NOT walked (generated, not authored here): ${tools.join(", ")}`);
  }
  const skipped = nestedClonesSkipped();
  if (skipped.length > 0) {
    console.log(`nested clones NOT walked (their files are not this package's): ${skipped.join(", ")}`);
  }
  for (const dir of skipped) {
    assert.ok(!dir.startsWith("src/"), `a nested clone inside src/ would hide component files: ${dir}`);
  }
});

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

  /**
   * dist/kit.css is the two registered copies concatenated in their required
   * order, emitted by the build so it can never disagree with them. It is not
   * an exemption: it is checked harder than a copy is, by reconstructing what
   * the build must have produced and requiring the file to equal it byte for
   * byte. A rule smuggled into the concatenation fails here, and so does a
   * header that carries one.
   */
  const derived = "dist/kit.css";

  const unexplained = [];
  for (const file of stylesheets) {
    const text = readLf(join(ROOT, file));
    if (file === FONT_SHEET) {
      /**
       * The bounded exception, and it is not an exemption: this file is checked
       * harder than a copy is, by the five tests below. The one assertion made
       * here is the one that belongs to THIS test, which is about what may
       * exist: a stylesheet the package emits is permitted only while every
       * rule in it is an @font-face.
       */
      const { faces, violations } = fontFaceRules(text);
      assert.deepEqual(violations, [], `${FONT_SHEET} carries something that is not an @font-face rule:\n${violations.join("\n")}`);
      assert.ok(faces.length > 0, `${FONT_SHEET} exists but declares no font face, so the exception buys nothing`);
      continue;
    }
    if (registered.has(file)) {
      const source = registered.get(file);
      const sha = createHash("sha256").update(text).digest("hex");
      assert.equal(sha, source.sha256, `${file} no longer matches its pinned upstream`);
      continue;
    }
    if (file === derived) {
      const header = text.slice(0, text.indexOf("*/") + 2);
      assert.ok(header.startsWith("/*"), `${derived} must open with the provenance comment`);
      assert.equal(
        header.includes("{"),
        false,
        `${derived}'s header carries something that is not a comment`,
      );
      assert.equal(
        text.slice(header.length),
        "\n" +
          readLf(join(ROOT, "vendor", "sc-kit.css")) +
          "\n" +
          readLf(join(ROOT, "vendor", "shell.css")),
        `${derived} is not exactly its two registered copies in order — the build added or dropped something`,
      );
      /* Named separately from the byte equality above so the reason survives:
         the font faces are a separate sheet BECAUSE this equality is
         load-bearing, and a future hand that folds them in fails here with the
         reason attached rather than with a diff. */
      assert.equal(
        /@font-face/i.test(text),
        false,
        `${derived} carries an @font-face rule. The font faces ship as ${FONT_SHEET}; folding them in here breaks the byte equality that keeps the concatenation honest.`,
      );
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

/* ------------------------------------------------------------------------- *
 * THE BOUNDED EXCEPTION. Five assertions, each proven able to fire by
 * scripts/prove-gates.mjs against a real injected violation.
 * ------------------------------------------------------------------------- */

test("gate 4 exception: the font sheet ships, and every rule in it is an @font-face", () => {
  assert.ok(
    existsSync(join(ROOT, FONT_SHEET)),
    `${FONT_SHEET} is missing; run the build. Without it the shipped CSS names two families the package does not carry, which is the defect this exception exists to fix.`,
  );
  const { faces, violations } = fontFaceRules(readLf(join(ROOT, FONT_SHEET)));
  assert.deepEqual(violations, [], `${FONT_SHEET} carries rules that are not @font-face rules:\n${violations.join("\n")}`);

  /* Counting rule: one face per @font-face rule, taken from the emitted sheet
     rather than from the manifest, so a face the manifest lists and the sheet
     drops is a mismatch below rather than an invisible pass here. */
  assert.equal(faces.length, fontManifest().faces.length, "the font sheet and fonts/FONTS.json disagree on how many faces there are");

  for (const face of faces) {
    assert.ok(face.family, "an @font-face rule declares no font-family");
    assert.equal(face.display, "swap", `${face.family} ${face.weight} does not set font-display swap`);
    assert.ok(face.urls.length > 0, `${face.family} ${face.weight} declares no src url`);
  }
});

test("gate 4 exception: every family the font sheet declares is named by a font token", () => {
  const { named } = tokenFamilies(readLf(join(ROOT, "vendor/sc-kit.css")));
  const { faces } = fontFaceRules(readLf(join(ROOT, FONT_SHEET)));

  const forks = [...new Set(faces.map((f) => f.family))].filter((f) => !named.has(f.toLowerCase()));
  assert.deepEqual(
    forks,
    [],
    `these families ship faces but no --sc-font- token names them, which is a fork of the design system rather than the declaration being fulfilled: ${forks.join(", ")}`,
  );
});

test("gate 4 exception: every family the token block names first is actually shipped", () => {
  /**
   * The inverse direction, and the reason this card exists. Before this change
   * the token block named Inter and IBM Plex Mono and the package shipped
   * neither, so this assertion fails against origin/main as it stood.
   *
   * Counting rule: only the FIRST entry of each font token value, and only when
   * that entry is a quoted family. The rest of each stack is a fallback list of
   * system faces, which are the operating system's to provide and not ours to
   * ship.
   */
  const { primary } = tokenFamilies(readLf(join(ROOT, "vendor/sc-kit.css")));
  assert.ok(primary.length > 0, "no font token names a family first, so this check would be vacuous");

  const { faces } = fontFaceRules(readLf(join(ROOT, FONT_SHEET)));
  const shipped = new Set(faces.map((f) => f.family.toLowerCase()));

  const missing = primary.filter((p) => !shipped.has(p.family.toLowerCase()));
  assert.deepEqual(
    missing.map((m) => `${m.token} names ${m.family}`),
    [],
    `the shipped CSS names these families but no @font-face ships it, so anything built from the package renders in a system fallback: ${missing.map((m) => m.family).join(", ")}`,
  );
});

test("gate 4 exception: every src url resolves to a file the package ships", () => {
  const { faces } = fontFaceRules(readLf(join(ROOT, FONT_SHEET)));
  const bad = [];
  for (const face of faces) {
    for (const url of face.urls) {
      if (/^[a-z]+:/i.test(url) || url.startsWith("//")) {
        bad.push(`${url} is remote; a font the package does not carry is the defect this exception fixes`);
        continue;
      }
      const resolved = join(ROOT, "dist", url.replace(/^\.\//, ""));
      if (!resolved.startsWith(join(ROOT, "dist") + sep)) {
        bad.push(`${url} escapes dist/`);
        continue;
      }
      if (!existsSync(resolved)) bad.push(`${url} does not resolve to a shipped file`);
    }
  }
  assert.deepEqual(bad, [], `the font sheet points at files the package does not ship:\n${bad.join("\n")}`);
});

test("gate 4 exception: every shipped font file is registered and matches its pinned hash", () => {
  const manifest = fontManifest();
  const registered = new Map(manifest.faces.map((f) => [f.file.replace(/^fonts\/files\//, ""), f]));
  const licences = new Set(manifest.licence.texts.map((l) => l.file));

  /* Counting rule: sha256 over the raw binary, because a woff2 is not text.
     Both copies are checked - the one in the repo and the one the build put in
     dist/ - because a build that mangles a font file on the way through would
     otherwise pass. */
  for (const [name, face] of registered) {
    for (const path of [join(ROOT, "fonts/files", name), join(ROOT, "dist/fonts", name)]) {
      assert.ok(existsSync(path), `${path} is missing`);
      const bytes = readFileSync(path);
      assert.equal(
        createHash("sha256").update(bytes).digest("hex"),
        face.sha256,
        `${path} no longer matches its pinned hash. Font files are copies; refresh with node scripts/fetch-fonts.mjs, never by hand.`,
      );
      assert.equal(bytes.length, face.bytes, `${path} byte count changed`);
    }
  }

  const inDist = readdirSync(join(ROOT, "dist/fonts")).sort();
  const unregistered = inDist.filter((f) => !registered.has(f) && !licences.has(f));
  assert.deepEqual(unregistered, [], `these files ship in dist/fonts but are registered nowhere: ${unregistered.join(", ")}`);

  for (const licence of manifest.licence.texts) {
    assert.ok(
      existsSync(join(ROOT, "dist/fonts", licence.file)),
      `${licence.file} does not ship. The Open Font License permits redistribution only when the licence travels with the files.`,
    );
  }
});

test("gate 4 exception: the shipped weights are exactly the ones the product asks for", () => {
  /**
   * The set of weights is not a choice made in this package. It is read from
   * vendor/index.html, the registered copy of the product's own page, whose font
   * URL is the authoritative statement of what the product loads. Two
   * implementations of that parse would drift, so the parser is imported from
   * the one the fetch script uses.
   */
  const requested = requestedFaces(productFontUrl(readLf(join(ROOT, "vendor/index.html"))));
  const shipped = new Set(fontManifest().faces.map((f) => `${f.family} ${f.weight}`));
  const asked = new Set(requested.map((r) => `${r.family} ${r.weight}`));

  const missing = [...asked].filter((a) => !shipped.has(a)).sort();
  assert.deepEqual(missing, [], `the product requests weights the package does not ship: ${missing.join(", ")}`);

  const extra = [...shipped].filter((s) => !asked.has(s)).sort();
  assert.deepEqual(extra, [], `the package ships weights the product does not ask for: ${extra.join(", ")}`);
});
