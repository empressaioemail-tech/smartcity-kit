/**
 * The design law, encoded where it can fail.
 *
 * 30b names five laws and a set of rulings. A wrapper cannot enforce most of
 * them, because it declares no styling. What it CAN do is decide what its API
 * makes easy, and that is what these tests hold.
 */
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as kit from "../dist/index.mjs";
import { ROOT, componentFiles, readLf } from "./_lib.mjs";

const render = (el) => renderToStaticMarkup(el);

/* ---------------------------------------------------- law 3, quiet defaults */

test("law 3: an unqualified Pill is the quietest form", () => {
  /* Pass is gray. If the default were anything else, the cheapest thing to
     write would be the loudest thing on the page, which is the inverse of the
     law the system is built on. */
  assert.equal(render(React.createElement(kit.Pill, null, "Pass")), '<span class="pill p-quiet">Pass</span>');
});

test("law 3: an unqualified SourceRow rail is neutral", () => {
  const html = render(React.createElement(kit.SourceRow, { name: "Adopted budget" }));
  assert.match(html, /class="srcreg"/);
  assert.doesNotMatch(html, /srcreg ok|srcreg partial/);
});

test("law 3: an unqualified NavItem is not active and not loud", () => {
  const html = render(React.createElement(kit.NavItem, null, "Parks"));
  assert.equal(html, '<a class="navitem">Parks</a>');
});

test("law 3: there is no lever that makes a status carrier louder than its meaning", () => {
  /* The failure this guards is an API shape, so it is checked at the API. A
     prop named for volume rather than meaning is the defect. */
  const banned = /\b(emphasis|filled|solid|strong|loud|prominent|intensity|variant|colou?r)\b\s*[?:]/;
  const hits = componentFiles().filter((f) => banned.test(readLf(join(ROOT, f))));
  assert.deepEqual(hits, [], `volume props found in: ${hits.join(", ")}`);
});

/* --------------------------------------------- section 1.6, elevation ruling */

test("section 1.6: no component offers an elevation, shadow or raised prop", () => {
  /* A resting panel has no shadow and is defined by its border. A prop that
     could set one would reopen a settled decision as a style option. */
  const banned = /\b(elevation|shadow|raised|elevated|depth)\b\s*[?:]/;
  const hits = componentFiles().filter((f) => banned.test(readLf(join(ROOT, f))));
  assert.deepEqual(hits, [], `elevation props found in: ${hits.join(", ")}`);
});

test("section 1.6: a resting Panel renders with no modifier at all", () => {
  assert.equal(render(React.createElement(kit.Panel, null, null)), '<div class="panel"></div>');
});

/* -------------------------------------------- section 1.3, the type ramp */

test("section 1.3: Text offers exactly the three steps the stylesheet ships", () => {
  const emitted = ["label", "caption", "data"].map((step) =>
    render(React.createElement(kit.Text, { step }, "x")),
  );
  assert.deepEqual(emitted, [
    '<span class="t-label">x</span>',
    '<span class="t-caption">x</span>',
    '<span class="t-data">x</span>',
  ]);
});

test("section 1.3: no component takes a numeric size or font-size prop", () => {
  const banned = /\b(fontSize|font_size|textSize|scale)\b\s*[?:]/;
  const hits = componentFiles().filter((f) => banned.test(readLf(join(ROOT, f))));
  assert.deepEqual(hits, [], `off-ramp type props found in: ${hits.join(", ")}`);
});

/* ------------------------------------- never-bare number, honest absence */

test("never-bare number: a Metric always renders its counting rule beside the value", () => {
  const html = render(
    React.createElement(kit.Metric, { label: "Overdue", value: 3, note: "of 14 generated cases in flight" }),
  );
  assert.match(html, /class="metric has-value"/);
  assert.match(html, /<span class="n">of 14 generated cases in flight<\/span>/);
});

test("never-bare number: an unread Metric states a word, never a zero", () => {
  const html = render(
    React.createElement(kit.Metric, { label: "Meetings this week", unread: "Not read", note: "No clerk source" }),
  );
  assert.match(html, /class="v word"/);
  assert.doesNotMatch(html, /class="metric has-value"/);
  assert.match(html, /Not read/);
});

test("honest absence: a State always renders a basis line", () => {
  const html = render(
    React.createElement(kit.State, {
      kicker: "Pipeline unread",
      heading: "No cases are in flight on this pack.",
      basis: "no adapter granted and no records generated",
    }),
  );
  assert.match(html, /<span class="basis">Basis: no adapter granted and no records generated<\/span>/);
});

test("provenance: a Prov always labels its value", () => {
  assert.equal(
    render(React.createElement(kit.Prov, { source: "Public record" })),
    '<span class="prov"><b>Public record</b></span>',
  );
});

test("environment: EnvBadge has no default, so a demo can never render as live by omission", () => {
  const source = readLf(join(ROOT, "src/status.tsx"));
  assert.match(source, /environment:\s*"demo"\s*\|\s*"live"\s*\|\s*"staging";/);
  assert.doesNotMatch(source, /environment\s*=\s*"/);
});
