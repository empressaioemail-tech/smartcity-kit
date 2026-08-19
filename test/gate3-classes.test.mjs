/**
 * GATE 3 - every class a component emits exists in sc-kit.css or the product
 * stylesheet.
 *
 * This is the gate that catches real mistakes, so it is structural rather than
 * declarative: nothing here reads a hand-written list of classes. Every export
 * is RENDERED through the gallery, the class attributes are parsed out of the
 * rendered markup, and each token is checked against the stylesheet vocabulary.
 * A renamed class fails here the moment it is renamed.
 *
 * Two supporting assertions keep the gate from being dodged:
 *   - completeness: every export of the package appears in the gallery, so a
 *     component cannot avoid the check by being unregistered.
 *   - the per-entry `covers` list must equal what the entry actually renders,
 *     so the inventory this repo publishes cannot drift from what it does.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { GALLERY, SCREENS } from "../harness/out/gallery.mjs";
import * as kit from "../dist/index.mjs";
import { classesIn, stylesheetClasses } from "./_lib.mjs";

const SHIPPED = stylesheetClasses();

/** Everything the gallery renders, measured by rendering it. */
function emittedClasses() {
  const found = new Set();
  for (const entry of GALLERY) {
    for (const c of classesIn(renderToStaticMarkup(entry.node))) found.add(c);
  }
  for (const screen of SCREENS) {
    for (const c of classesIn(renderToStaticMarkup(screen.node))) found.add(c);
  }
  return found;
}

test("gate 3: every class the components emit exists in the shipped stylesheets", () => {
  const strays = [...emittedClasses()].filter((c) => !SHIPPED.has(c)).sort();
  assert.deepEqual(
    strays,
    [],
    `these classes are emitted by a component and exist in neither vendor/sc-kit.css nor vendor/shell.css: ${strays.join(", ")}`,
  );
});

test("gate 3: the vocabulary denominator is the shipped stylesheet class set", () => {
  /* Counting rule stated at the point of use: distinct class-selector tokens in
     the two vendored stylesheets, comments stripped.

     Moved from 109 to 139 at G-88, when the product shipped the code citation,
     evidence chip, applicability matrix and finding row into shell.css. Thirty
     added, none removed, and both sides were measured with this same rule
     rather than one being derived by subtraction. The pin failing on the
     re-vendor is this gate working: it had been passing on a stale copy of
     shell.css, which is a gate being lied to rather than a gate holding.

     Moved from 139 to 143 at G-90, when the product shipped the top-bar menu
     and its popover chrome into shell.css: topmenu, pop, pop-group, pop-item.
     Four added, none removed. Measured the same way, and the same way the pin
     went red again: the kit's green had expired under a product merge and was
     still reading as green because the vendored copy was stale. The stripping
     half of the rule is load-bearing rather than theoretical here too. Counting
     the same two copies WITHOUT stripping comments returns 150, and the seven
     phantom tokens are css hidden html js md mjs test, all of which appear only
     inside prose. */
  assert.equal(SHIPPED.size, 143, "the shipped class vocabulary changed size");
});

test("coverage: the package covers the whole shipped vocabulary", () => {
  const emitted = emittedClasses();
  const uncovered = [...SHIPPED].filter((c) => !emitted.has(c)).sort();
  const pct = ((SHIPPED.size - uncovered.length) / SHIPPED.size) * 100;
  assert.deepEqual(
    uncovered,
    [],
    `${SHIPPED.size - uncovered.length} of ${SHIPPED.size} classes covered (${pct.toFixed(1)} percent). Uncovered: ${uncovered.join(", ")}`,
  );
});

test("gate 3: every export of the package appears in the gallery", () => {
  const exported = Object.keys(kit).filter((k) => typeof kit[k] === "function").sort();
  const registered = new Set(GALLERY.map((e) => e.component));
  const missing = exported.filter((name) => !registered.has(name));
  assert.deepEqual(
    missing,
    [],
    `these exports render no example, so gate 3 never sees the classes they emit: ${missing.join(", ")}`,
  );
});

test("gate 3: every gallery entry names a real export", () => {
  const unknown = GALLERY.map((e) => e.component).filter((name) => typeof kit[name] !== "function");
  assert.deepEqual(unknown, [], `gallery entries naming no export: ${unknown.join(", ")}`);
});

test("gate 3: each entry's declared coverage equals what it renders", () => {
  const wrong = [];
  for (const entry of GALLERY) {
    const rendered = [...classesIn(renderToStaticMarkup(entry.node))].sort();
    const declared = [...new Set(entry.covers)].sort();
    if (rendered.join(",") !== declared.join(",")) {
      wrong.push(
        `${entry.component}: declares [${declared.join(" ")}] renders [${rendered.join(" ")}]`,
      );
    }
  }
  assert.deepEqual(wrong, [], `declared coverage does not match rendered output:\n${wrong.join("\n")}`);
});
