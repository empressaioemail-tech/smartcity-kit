# @empressaio/smartcity-kit

A typed React wrapper over the SmartCity design-system class vocabulary.

The kit renders the classes the product already ships and **owns no styling**. No token, no colour, no radius, no duration and no type step is declared here. It exists so that a design agent, or anyone drawing a new SmartCity surface, builds out of the real parts instead of inventing components that have to be rewritten before they can ship.

Ruling: `_decisions/2026-08-18_smartcity_kit_component_package.md`. Design law: `30b_smartcity_design_system.md`.

## The stylesheets are copies

`sc-kit.css` and `shell.css` in this package are **byte copies** of files that live somewhere else.

| File here | Canonical home |
|---|---|
| `vendor/sc-kit.css`, shipped as `dist/sc-kit.css` | `empressaioemail-tech/smartcity-dashboards` `web/sc-kit.css` |
| `vendor/shell.css`, shipped as `dist/shell.css` | `empressaioemail-tech/smartcity-dashboards` `web/shell.css` |

Change a design value **upstream**, never here. `vendor/UPSTREAM.json` pins the sha256 of every copy, and `test/vendor-parity.test.mjs` fails if a copy is edited or if upstream drifts away from it. To take a new copy:

```
npm run refresh:vendor -- ../smartcity-dashboards
npm test
```

`vendor/index.html`, `vendor/app.js` and `vendor/30b-section-4.1.css` are reference material for the tests. They are never published.

## Install

```
npm install @empressaio/smartcity-kit react
```

React is a peer dependency. Import the stylesheets once, at the root of your app, in this order:

```js
import "@empressaio/smartcity-kit/sc-kit.css";
import "@empressaio/smartcity-kit/shell.css";
```

Set the theme on the document element. Dark is the staff default; light is production quality, not a courtesy.

```html
<html data-theme="dark">
```

## Use

```jsx
import { Panel, PanelHead, State, Pill, Prov, Metric, MetricStrip } from "@empressaio/smartcity-kit";

<MetricStrip>
  <Metric label="Overdue" value={3} note="of 14 generated cases in flight" />
  <Metric label="Meetings this week" unread="Not read" note="No clerk source" />
</MetricStrip>

<Panel>
  <PanelHead title="Public meetings">
    <Prov source="City clerk calendar" detail={<span>unread</span>} />
  </PanelHead>
  <State
    kicker="Calendar unread"
    heading="No meeting packet has been read."
    basis="no clerk calendar grant has been read for this pack"
  >
    Public meetings list records from a clerk calendar grant.
  </State>
</Panel>
```

Every component has a worked example drawn from a real shipped screen in `examples/gallery.tsx`, and `examples/screens.tsx` composes the whole Overview staff shell. Render them:

```
npm run build
npm run gallery
```

That writes `harness/out/gallery.html`, a composed screen, and the shipped page for comparison, then screenshots each with headless Chrome.

## What the API will not let you do

The design law is enforced by the shape of the props, not by review.

- **No `className` and no `style`.** Both are removed from every prop type. A foreign class or an inline value is a fork of the design system, so neither is representable.
- **Quiet by default.** `Pill` defaults to `meaning="quiet"` and has no emphasis, size or colour lever. There is no way to make a status carrier louder than its meaning, which is the third law of the system in reverse gear.
- **No bare number.** `Metric` is a discriminated union: either a value with its counting rule, or a word saying nothing was read, with its reason. Both arms require `note`. A zero can never stand in for an unknown.
- **No absence without a basis.** `State` requires `kicker`, `heading` and `basis`. An unexplained empty state is a type error.
- **No elevation.** `Panel` has no shadow or elevation prop. A resting panel is defined by its border.
- **No type step outside the ramp.** `Text` offers exactly the three the stylesheet ships.

## Coverage

The package covers **109 of 109** classes in the shipped vocabulary. The denominator is the set of distinct class-selector tokens in `vendor/sc-kit.css` and `vendor/shell.css` with CSS comments stripped, including state modifiers and element-scoped children.

Coverage is measured by rendering, not declared: `test/gate3-classes.test.mjs` renders every component through the gallery, parses the class attributes out of the output, and checks each token against the stylesheets. A separate test asserts every export appears in the gallery, so nothing can dodge the check by being unregistered.

Classes named in `30b` section 3.9 but present in neither shipped stylesheet are **not** implemented, because a component emitting a class no stylesheet defines would render unstyled. That list is in the close artifact for G-82.

## Tests

```
npm test          # builds, then runs the whole suite
npm run typecheck
```

The four conformance gates from the ruling:

| Gate | Test |
|---|---|
| 1. Declares no `--sc-` token of its own | `test/gate1-tokens.test.mjs` |
| 2. No hex, `rgb()`, hardcoded px or duration in a component | `test/gate2-values.test.mjs` |
| 3. Every emitted class exists in a shipped stylesheet | `test/gate3-classes.test.mjs` |
| 4. Adds no CSS rule of its own | `test/gate4-no-css.test.mjs` |

Beyond the gates: markup parity against the shipped page, the classes the product builds at runtime, the design-law prop shapes, the upstream copy check, and a consumer test that packs the package, installs the tarball and imports it by name.
