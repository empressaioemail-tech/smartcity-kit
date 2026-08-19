# design-sync notes — @empressaio/smartcity-kit

Repo-specific gotchas for future syncs. Read before re-running.

## Setup

- Node 22+. `npm ci` then `npm run build` — `dist/` is gitignored, so a fresh clone must build before the converter runs.
- Converter entry is `./dist/index.mjs`. `--node-modules ./node_modules` (react and react-dom are devDeps here; react is a *peer* dep of the package).
- Playwright: the machine's browser cache lives at `$LOCALAPPDATA/ms-playwright`, not `~/.cache/ms-playwright`. Export `PLAYWRIGHT_BROWSERS_PATH="$LOCALAPPDATA/ms-playwright"` before `package-validate.mjs` or it downloads a second copy.
- **Pin playwright to the version whose `browsers.json` matches a cached chromium build.** As of 2026-08-18 the cache held chromium 1140/1200/1217/1223/1228 and `playwright@1.57.0` pins 1200. `playwright@latest` pinned 1234 and failed with `Executable doesn't exist`. Check `https://raw.githubusercontent.com/microsoft/playwright/v<X.Y.Z>/packages/playwright-core/browsers.json` before installing.

## Config decisions and why

- **`cssEntry` is `./dist/kit.css`, not the two separate stylesheets.** `shell.css` consumes `var(--sc-*)` throughout and defines none of them; the closure takes ONE entry. Pointing it at `shell.css` shipped the component CSS with all 63 token definitions missing — every design renders a complete layout with every colour, size and radius falling back, and nothing downstream catches it. `dist/kit.css` is the two concatenated in their required order (kit PR #2).
- **`cfg.tokensGlob` is a no-op without `cfg.tokensPkg`.** It resolves a sibling tokens *package* out of `node_modules`; it cannot point at a file in the DS's own `dist/`. Setting it alone silently copies nothing and leaves `tokens/` empty. That is what hid the problem above on the first run.
- **`extraFonts: ["./dist/fonts.css"]`** picks up all 43 `@font-face` rules and copies the woff2 into `fonts/` (kit PR #3).

## Known render warns

Triaged as legitimate. A warn NOT in this list is new — look at it before recording it.

- `[FONT_MISSING] "Inter Variable", "Cascadia Mono"` — expected and correct. Both are fallback-stack entries, not primary faces: `Inter Variable` is the locally-installed variable build of Inter, `Cascadia Mono` is a Windows system face. The kit ships the two families the token block names as primaries (Inter, IBM Plex Mono) and deliberately does not redistribute system faces. The README says so.
- Unauthored components render the typographic floor card. That is the designed baseline, not a failure — `fallbackCard: true` in `.render-check.json`.

## Gotchas that cost a cycle

- **The kit's own gate 4 scans the whole repo for stylesheets** and read design-sync's `ds-bundle/` output as the package authoring CSS. `ds-bundle/`, `.ds-sync/` and `.design-sync/` are now in the test's recorded tool-output skip set (kit PR #2). If a future converter version writes somewhere else inside the workspace, gate 4 will flag it — add the directory to `TOOL_OUTPUT_DIRS` in `test/_lib.mjs`, do not weaken the gate.
- Byte-comparing the vendored stylesheets against upstream with `md5sum` on a Windows checkout reports DIFFERENT because of CRLF. Compare git blob hashes (`git rev-parse HEAD:path`), which are normalized.

## Re-sync risks

- **`dist/` is gitignored and the converter reads it.** A re-sync that skips `npm run build` converts a stale or absent dist. Always rebuild.
- **The vendored stylesheets can drift from upstream.** `test/vendor-parity.test.mjs` arm B only runs when `SC_DASHBOARDS_DIR` points at a `smartcity-dashboards` checkout; locally it declares itself unrun and CI sets it. If the product's CSS changes, the kit needs `npm run refresh:vendor` and a re-sync, or the synced design system silently lags the product.
- **The font weight set is derived from the product**, parsed out of the font-host URL in `vendor/index.html`. If the product changes the weights it loads, the kit's gate fails until the fonts are refetched. That is intended.
- **Preview compositions come from `examples/gallery.tsx`**, which is maintained in the kit and covers all 82 components with real fixture data. If a component's API changes, its GALLERY entry is the thing to update first — the previews port from it.
- **RESOLVED at G-88.** Two of the five components `30b` section 3.1 calls load-bearing — the applicability matrix (`mx*`) and the code citation (`cite`) — had no CSS in any shipped stylesheet, so the kit could not wrap them and the design agent would have invented them. The product shipped all four families into `shell.css` at G-88 item 2, the kit re-vendored and wrapped them at item 5, and the vocabulary went from 109 classes to 139. Plan Review is no longer the gap.

## The dark-theme trap — do not set cfg.provider to Theme

`30b` makes dark the staff default and the product ships `<html data-theme="dark">`. The
obvious way to match that in previews is `cfg.provider: {"component":"Theme","props":{"mode":"dark"}}`.
**It renders broken and it is not obvious from a passing build.**

`Theme` emits `<div class="sc-dark">`, and `.sc-dark` redefines the `--sc-*` token values
and declares no background. The card's ground comes from `body { background: var(--sc-canvas) }`
in shell.css, which resolves from `:root` — still light. The result is dark-theme ink
(near-white `--sc-ink`) on a light canvas: `MetricStrip` looks perfect because `.metric`
paints its own surface, while `State` headings become almost invisible. A component that
paints its own background hides the fault; one that inherits it shows it.

The only correct fix is the theme on the ROOT element, which is what the product does, and
`cfg.provider` can only wrap an inner element. Until the converter grows a root-attribute
hook, previews render light. Light is a first-class theme in this system ("light = paper"),
so the cards are correct — they are just not the staff default. The conventions header is
where the design agent is told that dark is the staff default and how to set it.

If a future converter version supports a root attribute or a body class, that is the fix
to reach for. Do not solve it by wrapping every preview in a Panel: that changes what the
card is showing.

## Preview authoring

Compositions come from `examples/gallery.tsx` in this repo: one `GALLERY` entry per
component, all 73, each with `covers` (the classes it exercises), `from` (which shipped
screen it was taken from) and a real `node`. Porting an entry into
`.design-sync/previews/<Name>.tsx` means splitting its JSX into named exports, one per
card cell. Keep the fixture content — it comes from the product's own fixture pack and is
already realistic.

Solo-calibrated on Pill, State and MetricStrip (simple / text-heavy / compound). All three
graded good and carry forward. Budget 2-3 cells each; the components are small and a
single canonical composition plus its variant axis is usually the whole story.
