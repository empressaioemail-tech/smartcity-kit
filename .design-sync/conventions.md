# SmartCity kit conventions

This is the visual law a design agent must obey when composing from these components. Every class and token named here exists in the shipped stylesheet. Do not invent a class, a token, or a third typeface.

## Theme

Dark is the staff default. Set it on the root: `<html data-theme="dark">`. Light is first-class ("light = paper") and is the citizen default. Force a subtree with `Theme mode="light"` or `Theme mode="dark"`, which emit `.sc-light` and `.sc-dark`. Those classes redefine tokens on an inner element and paint no ground, so they are for a citizen column inside a staff session, not for the page. Never wrap the tree in `Theme mode="dark"` as a page provider. The canvas comes from `body { background: var(--sc-canvas) }`, which reads `:root`.

## Five laws

1. One second to orient. Where am I, what needs me, what is missing, in that order.
2. One of everything. One type ramp, one 4px spacing scale, one radius family, one accent.
3. Quiet on satisfied, loud on unresolved. Pass is gray. The loudest object is the row that needs someone.
4. Records, not feeds. A connected system becomes rows with a provenance chip.
5. Absence is stated, never simulated. No zero budget, no placeholder count, no empty rectangle standing in for unread.

## Type

`--sc-font-ui` is Inter. `--sc-font-data` is IBM Plex Mono. If a person would read it aloud as a number or a code it is mono (`.t-data`). If they would read it aloud as a sentence it is Inter. 12px is the floor. Ramp steps in use: `.t-label` (12/16 uppercase mono), `.t-caption` (12/16 metadata), `.t-data` (13/18 identifiers). Panel titles are 15/22 on `.panel-head .t`. Lens titles are rare.

## Color

Status color lives only in status carriers: `.pill` plus `.p-ok` `.p-info` `.p-warn` `.p-crit` `.p-restricted` `.p-quiet`, the 3px `.srcreg .rail`, and the environment badge. Never a card background, never a panel border in a status hue, never the text of a subject line. Two colored things per region maximum. `--sc-accent` (`#0B6A7B` light, `#4EAFC2` dark) means you can act, or this is where you are. `--sc-atom` (`#177F78` light, `#4CC9C0` dark) marks openable recorded evidence and is not chrome. Amber is the environment badge only (`.env.demo`).

Resting panels are `.panel`: `--sc-surface`, 1px `--sc-line`, `--sc-r` 6px, no shadow. Elevation is for overlays. Do not float a card.

## Absence

`.state` is the honest-empty. It carries a kicker (`.st-k`), a heading, a `.basis` line naming what is missing and why, and optional body. `.state.compact` is the short form. A metric that has not been read uses `unread="Not read"` on `Metric`, which paints `.v.word` rather than a zero. A nav item on the roster but not wired is `.navitem.unbuilt` with a "Not built" badge. A source not connected is a `.srcreg` row with a quiet pill, not a green dot.

## Provenance

`.prov` is source name, `.sep`, last-read. Every value that came from somewhere carries one in the panel head. It is not openable. Do not merge it with an evidence chip. Do not put a vendor logo in the chrome.

**A chip can carry TWO figures, and when it does each one carries its own counting rule.** The navigation footer is the shipped example: how many sources are granted, and how many kinds are demonstrated with generated fixture records, which are two different claims because a demonstration connects nothing. Draw both figures together at the head of the chip and both counting rules together at the tail, separated by `.sep`, which is the order the product serves and the order the component emits. Do not pair each rule under its own figure and do not draw a third figure: there is no shape for one. The component API has no way to add a second figure without a rule for it, so a design that shows a bare second number cannot be built.

## Shell

`.shell` / `.shell-top` / `.shell-body` / `.shell-nav` / `.shell-main` / `.shell-regions`. Top bar is 52px and carries city (`.seal` `.brandcity`), environment (`.env`), search, who you are. It is not navigation. Sidebar is `.shell-nav` with `.navgroup` / `.navitem` / `.nav-foot`. Page header is `.pagehead`: `.crumb`, `.titlerow`, `.lede`, then `.metrics` with at most four `.metric` tiles. Work surface is `.shell-regions` (two columns) or `.shell-regions.solo`. Map and document sit in `.region` (`.region-bar`, `.region-canvas`, `.region-foot`), inside our border.

Top-bar menus are `.topmenu`, and that class is only an anchor: it holds a `.btn.btn-ghost.btn-sm` trigger and a `.panel.pop` panel, and the panel is a panel, never a bare `.pop`. Inside, `.pop-group` separates groups and `.pop-item` is a row. Nothing here is a new frame, a new shadow or a new type step; the panel, the header, the reason line and the controls are all classes this stylesheet already has. **An entry that is unavailable states why.** Draw it greyed with a `.basis` line giving the reason, in its own row or once for the group, and never draw an entry that is simply unresponsive: a control that has not heard from the server is not a broken button, it is a capability nobody has confirmed yet, and the difference has to be legible. The component API has no way to grey one out without a reason, so a design that shows one cannot be built.

## Tables

`.dt` is the queue. Fixed column order: mono identifier (`.id`), subject (`.subj`), stage, place, due, status pill. No zebra, no vertical grid, no per-cell fill. Row count belongs in a `.basis` under the table.

## Compass

`.cp-source` in the top bar presents `.cp-sheet` as a shared-element sheet, not a page, not a rail, not a bubble. Mandatory `.cp-scope` names city and lens. `.cp-thread` / `.cp-turn` / `.cp-note`. No avatar, no mascot, no AI badge.

## Citizen

`.cz-scroll` with `.sc-light` is the public lens inside a staff session. `.cz` is the 720px reading column. `.citizen-lookup` is the address field. Staff vocabulary does not leak: never publish a reviewer name, an internal routing step, or a live operational feed on an unauthenticated view.

## Evidence

Four families carry what a determination cites and what backs it. All four ship in the stylesheet and all four are wrapped, so do not invent a substitute for any of them.

`.cite` is the code citation. Two forms, and the form is chosen by the source, not by available space. Bare `.cite` is a city adopted ordinance, which carries no licensing constraint and may link to full quoted text. `.cite.model` is licensed model code: a full canonical corpus title above a section identifier, and **no slot for body copy anywhere in the family**. That absence is the enforcement mechanism. A section identifier and heading may sit beside our own analysis; the section body may not, at any density, in any layout. There is no compact form and an abbreviation alone is never printed.

`.atomchip` is the evidence chip and it marks a thing you can open and read the record of. It always carries a compact label and a mono record identifier (`.did`). `.atomchip.dead` is an unservable record and still opens. `.atomchip.web` is an unverified source: neutral, differently shaped, and it never wears the reserved accent. Numbers, emphasis, web links and unverified sources are not atom chips.

`.mx` is the applicability matrix and **it is inverted**. Rows group under a `.mxgroup` header that prints the full canonical title once. Pass is the quietest row on the page: grey text, no fill, no rail. Fail takes the critical rail and wash, Uncertain the warn rail and wash, and Unchecked a diagonal hatch, the plat-drawing convention for nobody has been here yet, because unreviewed is more dangerous than failed and must never read as clean. Never put a green wash on a passing row, and never leave a row without one of the four values.

`.finding` is the unit of a comment letter: rail, `.fid`, `.ftitle`, a `.fmeta` line carrying the citation and the sheet reference and the status pill, then `.basisline`, then `.fact` for adjudication. Accept and override sit at equal weight. Confidence always carries its state (baseline, provenance-backed or earned) plus source count and timestamp, in `.basisline .conf` with the `.meter`. A confidence value with no basis is prohibited by the shape of the component.

## What this kit does not ship

Documentation-only classes (`doc`, `plate`, `tbl`, `callout`, …) are not product. Classes the design law names but no stylesheet defines are not wrapped, because a component emitting a class no stylesheet defines renders unstyled. Do not invent one.

## Fixture content

Compositions use generated fixture records labelled as fixtures, or honest-empty. City name in chrome is "This city". The parcel identifier `48021:34137` is a demo fixture and must travel with that label. Do not assert a real city name as content. Do not draw a third-party vendor product as if it were a kit component, and do not name one in the chrome: a connected system is a row with a provenance chip, never a branded surface.

## Tokens in the stylesheet

Surface: `--sc-canvas` `--sc-surface` `--sc-surface-2` `--sc-surface-3`. Line: `--sc-line-faint` `--sc-line` `--sc-line-strong`. Ink: `--sc-ink` `--sc-ink-2` `--sc-ink-3`. Accent: `--sc-accent` `--sc-accent-hi` `--sc-accent-wash` `--sc-on-accent` `--sc-focus`. Semantic: `--sc-ok` `--sc-info` `--sc-warn` `--sc-crit` `--sc-restricted` `--sc-quiet` and matching `-wash`. Evidence: `--sc-atom` `--sc-atom-wash`. Grounds: `--sc-map-ground` `--sc-doc-ground`. Spacing `--sc-1` through `--sc-10`. Radius `--sc-r-control` `--sc-r` `--sc-r-lg` `--sc-r-full`.
