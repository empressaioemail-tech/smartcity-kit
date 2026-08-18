/**
 * The components render the markup the product ships.
 *
 * A type-checking build proves the API compiles. It does not prove a component
 * renders the right element with the right class in the right place, and that is
 * the only thing this package is for. So every claim here is a comparison
 * against vendor/index.html, a pinned copy of the page smartcity-dashboards
 * serves.
 *
 * The normalization contract is stated in test/_markup.mjs and is part of this
 * instrument. Only tag, class, element order, nesting and text are compared.
 */
import * as React from "react";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import {
  BrandCity,
  Button,
  EnvBadge,
  Grow,
  Input,
  Metric,
  MountNote,
  Pill,
  Prov,
  RegionBar,
  RegionFoot,
  RegisterGroup,
  SearchField,
  Seal,
  SourceRow,
  Text,
} from "../dist/index.mjs";
import { OverviewLens, SCREENS, Sidebar, TopBar } from "../harness/out/gallery.mjs";
import { ROOT, readLf } from "./_lib.mjs";
import { firstDifference, referencePage, shapeOf } from "./_markup.mjs";

const page = referencePage(readLf(join(ROOT, "vendor/index.html")));
const searchIcon = React.createElement(
  "svg",
  { width: "14", height: "14", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.6" },
  React.createElement("circle", { cx: "7", cy: "7", r: "4.5" }),
  React.createElement("path", { d: "M10.5 10.5L14 14" }),
);

/**
 * One row per component that has a static counterpart in the shipped page.
 * Components whose only shipped instance is built at runtime by app.js are
 * covered by the runtime-class test below and are named in the close as having
 * no static reference; they are NOT silently absent from this list.
 */
const CASES = [
  {
    component: "Pill",
    selector: "#lens-city-manager .titlerow .pill",
    node: React.createElement(Pill, null, "Empty"),
  },
  {
    component: "Prov, with detail",
    selector: "#overview-meetings .panel-head .prov",
    node: React.createElement(Prov, {
      source: "City clerk calendar",
      detail: React.createElement("span", null, "unread"),
    }),
  },
  {
    component: "Prov, bare",
    selector: "#lens-city-manager .region-foot .prov",
    node: React.createElement(Prov, { source: "Public record" }),
  },
  {
    component: "Metric, unread",
    selector: "#overview-metrics .metric",
    node: React.createElement(Metric, {
      label: "Needs a decision",
      unread: "Not read",
      note: "No operations source",
    }),
  },
  {
    component: "RegisterGroup",
    selector: "#overview-source-register .reg-group",
    node: React.createElement(RegisterGroup, null, "Built"),
  },
  {
    component: "SourceRow, neutral",
    selector: "#overview-source-register .srcreg",
    node: React.createElement(
      SourceRow,
      { name: "Development services", description: "Permits, inspections, licenses" },
      React.createElement(Pill, null, "Not connected"),
    ),
  },
  {
    component: "SourceRow, partial rail",
    selector: "#finance-source-register .srcreg.partial",
    node: React.createElement(
      SourceRow,
      {
        rail: "partial",
        name: "Permit fee revenue",
        description: "Fees assessed and collected, joined to the permit record",
      },
      React.createElement(Pill, { meaning: "warn" }, "Partial"),
    ),
  },
  {
    component: "RegionBar",
    selector: "#lens-city-manager .region-bar",
    node: React.createElement(
      RegionBar,
      { title: "The city" },
      React.createElement(Text, { step: "caption" }, "SmartSite"),
      React.createElement(Button, { kind: "ghost", size: "sm" }, "Expand"),
      React.createElement(Button, { kind: "ghost", size: "sm" }, "Full"),
    ),
  },
  {
    component: "RegionFoot",
    selector: "#lens-city-manager .region-foot",
    node: React.createElement(
      RegionFoot,
      null,
      React.createElement(Text, { step: "data" }, "48021:34137"),
      React.createElement(Text, { step: "caption" }, "Demo fixture"),
      React.createElement(Grow),
      React.createElement(Prov, { source: "Public record" }),
    ),
  },
  {
    component: "SearchField",
    selector: ".shell-top .searchwrap",
    node: React.createElement(
      SearchField,
      { icon: searchIcon, notBuilt: "Not built" },
      React.createElement(Input, {
        type: "search",
        placeholder: "Search records, parcels, cases",
        "aria-label": "Record search",
        disabled: true,
      }),
    ),
  },
  {
    component: "EnvBadge",
    selector: "#env-badge",
    node: React.createElement(EnvBadge, { environment: "demo" }, "Demo"),
  },
  { component: "Seal", selector: "#city-seal", node: React.createElement(Seal) },
  {
    component: "BrandCity",
    selector: ".shell-top .brandcity",
    node: React.createElement(
      BrandCity,
      null,
      React.createElement("data", { "data-pack-name": "" }, "This city"),
    ),
  },
  {
    component: "MountNote, with heading",
    selector: "#atab-map .mount-note",
    node: React.createElement(
      MountNote,
      { heading: "No asset layer" },
      "The city outline appears here once the city is drawn. Vendor fleet telemetry is not an asset layer, so nothing is plotted to make this map look populated.",
    ),
  },
];

for (const c of CASES) {
  test(`markup parity: ${c.component} matches ${c.selector}`, () => {
    const product = page.shapeAt(c.selector);
    const kit = shapeOf(renderToStaticMarkup(c.node));
    assert.equal(kit, product, `\n${firstDifference(kit, product)}\n\nkit:\n${kit}\n\nproduct:\n${product}`);
  });
}

test("markup parity: the composed top bar matches the shipped top bar", () => {
  const product = page.shapeAt(".shell-top");
  const kit = shapeOf(renderToStaticMarkup(TopBar()));
  assert.equal(kit, product, `
${firstDifference(kit, product)}`);
});

test("markup parity: the composed sidebar matches the shipped sidebar", () => {
  const product = page.shapeAt(".shell-nav");
  const kit = shapeOf(renderToStaticMarkup(Sidebar()));
  assert.equal(kit, product, `
${firstDifference(kit, product)}`);
});

test("markup parity: the composed Overview lens matches the shipped lens", () => {
  const product = page.shapeAt("#lens-city-manager");
  const kit = shapeOf(renderToStaticMarkup(OverviewLens()));
  assert.equal(
    kit,
    product,
    `the composed screen diverged from the shipped page:\n${firstDifference(kit, product)}`,
  );
});

test("markup parity: the composed screen is registered and non-empty", () => {
  assert.equal(SCREENS.length, 1);
  assert.equal(SCREENS[0].mirrors, "smartcity-dashboards web/index.html, section#lens-city-manager");
});

test("markup parity: the queue table head matches the shipped column order", () => {
  const heads = page.root
    .querySelectorAll("#ds-pipeline-records .dt thead th")
    .map((th) => th.text.trim());
  assert.deepEqual(heads, ["Case", "Subject", "Stage", "Place", "Due", "Status"]);
});
