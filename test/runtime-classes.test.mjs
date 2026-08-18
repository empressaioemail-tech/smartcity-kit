/**
 * The classes the product builds at RUNTIME.
 *
 * index.html is not the whole product vocabulary in use. app.js constructs the
 * populated queue rows, the meetings rows and several state modifiers in
 * JavaScript, so those classes appear in no static markup and a parity test that
 * only reads index.html would report full coverage while never seeing them.
 * This is the same shape as measuring a class by subtraction: the honest fix is
 * to measure the second source too.
 *
 * Extraction rule, stated where its output is read: string literals assigned by
 * `el.className = "..."`, by a `className = \`... ${x}\`` template whose static
 * head is a class list, and by classList.add / remove / toggle("..."), read out
 * of vendor/app.js. It does NOT attempt to resolve computed class names; the
 * severity map in app.js is a plain object literal and is read separately.
 */
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { GALLERY, SCREENS } from "../harness/out/gallery.mjs";
import { ROOT, classesIn, readLf, stylesheetClasses } from "./_lib.mjs";

const app = readLf(join(ROOT, "vendor/app.js"));

function runtimeClasses() {
  const found = new Set();
  const add = (blob) => {
    for (const token of blob.split(/\s+/)) if (token && !token.includes("$")) found.add(token);
  };
  for (const m of app.matchAll(/className\s*=\s*"([^"]*)"/g)) add(m[1]);
  for (const m of app.matchAll(/className\s*=\s*`([^`]*)`/g)) add(m[1].replace(/\$\{[^}]*\}/g, " "));
  /* classList.toggle takes a SECOND argument that is a condition, not a class.
     Reading every literal inside the parens captured "presented" and "max" from
     `toggle("is-presented", state === "presented")` and reported two classes the
     product does not have. Only the first argument is a class. */
  for (const m of app.matchAll(/classList\.(?:add|remove|toggle)\(([^)]*)\)/g)) {
    for (const arg of m[1].split(",")) {
      const lit = arg.match(/^\s*"([^"]*)"\s*$/);
      if (lit) add(lit[1]);
      else break;
    }
  }
  /* The severity map: a record meaning is turned into a carrier in exactly one
     place, and that object literal is the only computed source of pill classes. */
  const severityMap = app.match(/const SEVERITY_PILL\s*=\s*\{([\s\S]*?)\}/);
  if (severityMap) for (const lit of severityMap[1].matchAll(/"([^"]*)"/g)) add(lit[1]);
  return found;
}

function emitted() {
  const found = new Set();
  for (const entry of GALLERY) for (const c of classesIn(renderToStaticMarkup(entry.node))) found.add(c);
  for (const s of SCREENS) for (const c of classesIn(renderToStaticMarkup(s.node))) found.add(c);
  return found;
}

test("the runtime extractor actually finds classes", () => {
  const found = runtimeClasses();
  assert.ok(found.size >= 10, `expected the runtime class set, found ${found.size}`);
  /* Proven able to fire on a known member: app.js builds meetings rows as srcreg. */
  assert.ok(found.has("srcreg"), "the extractor missed a class app.js demonstrably assigns");
});

test("every class app.js assigns at runtime exists in the shipped stylesheets", () => {
  const shipped = stylesheetClasses();
  const strays = [...runtimeClasses()].filter((c) => !shipped.has(c)).sort();
  assert.deepEqual(strays, [], `app.js assigns classes no stylesheet defines: ${strays.join(", ")}`);
});

test("the kit covers every class the product builds at runtime", () => {
  const covered = emitted();
  const missing = [...runtimeClasses()].filter((c) => !covered.has(c)).sort();
  assert.deepEqual(
    missing,
    [],
    `these classes are produced by the running product and by no kit component: ${missing.join(", ")}`,
  );
});
