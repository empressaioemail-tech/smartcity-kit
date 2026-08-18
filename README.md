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

`fonts/` is copies too, of a different upstream: it holds the two typefaces the
token block names, registered in `fonts/FONTS.json` with a source URL and a
sha256 each. It is deliberately not a row in `vendor/UPSTREAM.json`, which means
"copy of `smartcity-dashboards`" and is byte-compared against a live checkout of
that repo by `test/vendor-parity.test.mjs`. See the typefaces section below.

## Install

```
npm install @empressaio/smartcity-kit react
```

React is a peer dependency. Import **two** stylesheets once, at the root of your app:

```js
import "@empressaio/smartcity-kit/fonts.css";
import "@empressaio/smartcity-kit/kit.css";
```

`kit.css` is `sc-kit.css` followed by `shell.css`, concatenated at build time. The
order **inside** it is load-bearing and one import cannot get it wrong:
`shell.css` consumes `var(--sc-*)` throughout and defines none of them, so the
reverse order renders a complete layout with every colour, size and radius
silently falling back.

The order **between** `fonts.css` and `kit.css` is not load-bearing, and this
README says so rather than inventing a rule: `@font-face` declares faces and the
token block names families, and neither depends on the other having been parsed.
What matters is that `fonts.css` is imported at all.

**If you skip `fonts.css`**, nothing errors and nothing warns. The token block
still names `Inter` and `IBM Plex Mono`, the browser finds neither, and every
string in your app renders in the next entry of the fallback stack. The layout
survives; the type ramp does not, because the ramp is eight steps of size,
weight and tracking calibrated on two specific faces, and 650 in particular is
not a weight a fallback stack has. This was the state of the package before
version 0.1.1, and no test downstream caught it, which is why it is the first
thing this section says.

The stylesheets stay exported separately for anyone who needs them apart:

```js
import "@empressaio/smartcity-kit/sc-kit.css";
import "@empressaio/smartcity-kit/shell.css";
```

Set the theme on the document element. Dark is the staff default; light is production quality, not a courtesy.

```html
<html data-theme="dark">
```

## The typefaces

Two faces, two jobs. `--sc-font-ui` is Inter and carries every string a person
would read aloud as a sentence. `--sc-font-data` is IBM Plex Mono and carries
every string a person would read aloud as a number or a code.

The package ships both, and ships exactly the weights the product asks its font
host for, read out of `vendor/index.html` rather than chosen here:

| Family | Weights | Files | Licence |
|---|---|---|---|
| Inter | 400, 500, 600, 650 | 28 `woff2`, one per weight per subset | SIL Open Font License 1.1 |
| IBM Plex Mono | 400, 500, 600 | 15 `woff2`, one per weight per subset | SIL Open Font License 1.1 |

Both are Google Fonts' own subsetted builds, taken from the URLs the product's
page resolves to and redistributed unmodified. Every file carries its source
URL, byte count and sha256 in `fonts/FONTS.json`, and each family's `OFL.txt`
ships beside the binaries in `dist/fonts/`, because the licence permits
redistribution only when it travels with the files. Refresh with
`npm run fetch:fonts`, never by hand.

Each weight ships as one file per unicode subset (latin, latin-ext, cyrillic,
cyrillic-ext, greek, greek-ext, vietnamese), the same split the font host
serves. `unicode-range` on each rule means a browser fetches only the slices the
text on the page needs: a Latin screen loads 7 files of the 43, measured.

**`Cascadia Mono` is not shipped and is not missing.** It sits in the middle of
the `--sc-font-data` fallback stack along with `ui-monospace`, `SF Mono`,
`Segoe UI Mono` and `Consolas`. Those are the operating system's faces, offered
by the stack when the shipped one has not arrived yet; they are not ours to
redistribute and nothing in this package should carry them. The same is true of
`Inter Variable` in the `--sc-font-ui` stack, which is the name a locally
installed Inter answers to.

The `@font-face` rules are the **only** CSS rule this package writes, under the
one bounded exception in the ruling, and `test/gate4-no-css.test.mjs` is what
keeps the exception from widening: every rule in `fonts.css` must be an
`@font-face`, every family it declares must be one the token block already
names, every `src` must resolve to a file that ships, and every shipped file
must match its pinned hash. They are deliberately not folded into `kit.css`,
whose byte equality with its two registered copies is load-bearing.

Fonts load or they do not, and text cannot tell you which:

```
npm run build
npm run prove:fonts
```

That renders both stacks through headless Chrome, reports each family's
`FontFace` entries and how many the browser loaded, and measures the same
string against the same stack with the shipped family removed. Two different
widths is the proof. `document.fonts.check()` is printed but asserted on
nothing: it returns `true` for a family no rule declares, measured.

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
| 4. Adds no CSS rule of its own, except `@font-face` for families the token block already names | `test/gate4-no-css.test.mjs` |

Gate 4's exception is the only place the package writes CSS, and it is held
narrow by five assertions rather than by intent. Each is watched failing against
a real injected violation by `npm run prove:gates`, which is the harness that
proves a gate can fire at all.

Beyond the gates: markup parity against the shipped page, the classes the product builds at runtime, the design-law prop shapes, the upstream copy check, and a consumer test that packs the package, installs the tarball and imports it by name.
