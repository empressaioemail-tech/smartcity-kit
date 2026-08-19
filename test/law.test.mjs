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

/* ------------------------------------------ the evidence layer, G-88 item 5 */

test("licensed code: the model citation has no body slot, so licensed text cannot leak", () => {
  /* The ICC terms let this system show a section identifier and heading beside
     its own analysis and do not let it show the section body. The rule is held
     by making the body unrepresentable rather than by review, so the check is
     at the type: children is removed from the prop bag. test/consumer.test.mjs
     watches the compiler actually reject a body on the offending line; this
     asserts the removal is still in the source that produces those types. */
  const source = readLf(join(ROOT, "src/evidence.tsx"));
  assert.match(source, /Omit<AnchorBase,\s*"children">/);
  assert.equal(
    render(
      React.createElement(kit.ModelCite, {
        corpus: "2018 International Building Code",
        section: "Section 1004.5",
      }),
    ),
    '<a class="cite model"><span class="corpus">2018 International Building Code</span><span class="sect">Section 1004.5</span></a>',
  );
});

test("inverted applicability: MatrixRow has no default, so an unreviewed row cannot render as passed", () => {
  /* Applicability inverts the third law: pass is the QUIETEST row, so the
     defaulting pattern the rest of this package uses would put the clean state
     one omission away. There is deliberately no default at all, which is the
     EnvBadge shape rather than the Pill shape. Checked at the source, because
     the defect is an API decision and a rendered example cannot show the
     absence of a default. */
  const source = readLf(join(ROOT, "src/evidence.tsx"));
  assert.doesNotMatch(source, /applicability\s*=\s*"/);
});

test("inverted applicability: the four values map to the four state classes and nothing else", () => {
  const row = (applicability) =>
    render(
      React.createElement(kit.MatrixRow, { applicability, section: "Section 5.3.2", statement: "Front setback" }),
    );
  assert.match(row("pass"), /class="mxrow mx-pass"/);
  assert.match(row("fail"), /class="mxrow mx-fail"/);
  assert.match(row("uncertain"), /class="mxrow mx-unc"/);
  assert.match(row("unchecked"), /class="mxrow mx-unchecked"/);
  /* And the pass arm adds no carrier of its own. The quiet state is quiet by
     getting nothing, so anything extra here would be the inversion reversed. */
  assert.equal(
    row("pass"),
    '<div class="mxrow mx-pass"><i class="rail"></i><span class="sec">Section 5.3.2</span><span class="txt">Front setback</span></div>',
  );
});

test("never-bare confidence: the meter exists only inside a basis line", () => {
  /* A confidence value cannot render without the state, source count and
     timestamp that earn it. The meter is not exported, so there is no way to
     put one on a page except through BasisLine, which requires both. */
  assert.equal(typeof kit.Meter, "undefined");
  assert.equal(typeof kit.Confidence, "undefined");
  const html = render(
    React.createElement(kit.BasisLine, {
      confidence: { state: "provenance-backed", level: 3, of: 4 },
      sources: "3 sources",
      read: "2026-08-17 09:42",
    }),
  );
  assert.match(html, /<span class="meter">/);
  assert.match(html, /3 sources/);
  assert.match(html, /2026-08-17 09:42/);
  assert.match(html, /provenance-backed/);
});

test("never-bare confidence: a Finding constructs its own basis line, so it cannot omit one", () => {
  const html = render(
    React.createElement(kit.Finding, {
      identifier: "F-04",
      title: "Occupant load exceeds the value the submitted plan is designed to.",
      basis: { confidence: { state: "earned", level: 4, of: 4 }, sources: "3 sources", read: "determined 2026-08-17 09:42" },
    }),
  );
  assert.match(html, /<div class="basisline">/);
  assert.match(html, /3 sources/);
  assert.match(html, /determined 2026-08-17 09:42/);
});

test("the evidence chip and the unverified source are different elements, not one with a flag", () => {
  /* The reserved accent marks a thing you can open. An unverified source cannot
     be opened, so it must not be able to carry the openable affordance. Held by
     the element, not by a prop. */
  const chip = render(React.createElement(kit.AtomChip, { record: "zoning 48021:34137" }, "Record"));
  const web = render(React.createElement(kit.UnverifiedSource, null, "Web, unverified"));
  assert.match(chip, /^<button type="button" class="atomchip" aria-expanded="false">/);
  assert.equal(web, '<span class="atomchip web">Web, unverified</span>');
  assert.doesNotMatch(web, /aria-expanded/);
});

test("environment: EnvBadge has no default, so a demo can never render as live by omission", () => {
  const source = readLf(join(ROOT, "src/status.tsx"));
  assert.match(source, /environment:\s*"demo"\s*\|\s*"live"\s*\|\s*"staging";/);
  assert.doesNotMatch(source, /environment\s*=\s*"/);
});
