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

## Shell

`.shell` / `.shell-top` / `.shell-body` / `.shell-nav` / `.shell-main` / `.shell-regions`. Top bar is 52px and carries city (`.seal` `.brandcity`), environment (`.env`), search, who you are. It is not navigation. Sidebar is `.shell-nav` with `.navgroup` / `.navitem` / `.nav-foot`. Page header is `.pagehead`: `.crumb`, `.titlerow`, `.lede`, then `.metrics` with at most four `.metric` tiles. Work surface is `.shell-regions` (two columns) or `.shell-regions.solo`. Map and document sit in `.region` (`.region-bar`, `.region-canvas`, `.region-foot`), inside our border.

## Tables

`.dt` is the queue. Fixed column order: mono identifier (`.id`), subject (`.subj`), stage, place, due, status pill. No zebra, no vertical grid, no per-cell fill. Row count belongs in a `.basis` under the table.

## Compass

`.cp-source` in the top bar presents `.cp-sheet` as a shared-element sheet, not a page, not a rail, not a bubble. Mandatory `.cp-scope` names city and lens. `.cp-thread` / `.cp-turn` / `.cp-note`. No avatar, no mascot, no AI badge.

## Citizen

`.cz-scroll` with `.sc-light` is the public lens inside a staff session. `.cz` is the 720px reading column. `.citizen-lookup` is the address field. Staff vocabulary does not leak: never publish a reviewer name, an internal routing step, or a live operational feed on an unauthenticated view.

## What this kit does not ship

The applicability matrix (`.mx` `.mxrow` `.mx-pass` `.mx-fail` `.mx-unc` `.mx-unchecked`), the code citation (`.cite`), and the atom chip (`.atomchip`) are named in the design law and have no CSS in any shipped stylesheet. Do not invent them. Draw Plan Review without those three until the product ships their CSS. Documentation-only classes (`doc`, `plate`, `tbl`, `callout`, …) are not product.

## Fixture content

Compositions use generated fixture records labelled as fixtures, or honest-empty. City name in chrome is "This city". The parcel identifier `48021:34137` is a demo fixture and must travel with that label. Do not assert a real city name as content. Do not draw a third-party vendor product as if it were a kit component, and do not name one in the chrome: a connected system is a row with a provenance chip, never a branded surface.

## Tokens in the stylesheet

Surface: `--sc-canvas` `--sc-surface` `--sc-surface-2` `--sc-surface-3`. Line: `--sc-line-faint` `--sc-line` `--sc-line-strong`. Ink: `--sc-ink` `--sc-ink-2` `--sc-ink-3`. Accent: `--sc-accent` `--sc-accent-hi` `--sc-accent-wash` `--sc-on-accent` `--sc-focus`. Semantic: `--sc-ok` `--sc-info` `--sc-warn` `--sc-crit` `--sc-restricted` `--sc-quiet` and matching `-wash`. Evidence: `--sc-atom` `--sc-atom-wash`. Grounds: `--sc-map-ground` `--sc-doc-ground`. Spacing `--sc-1` through `--sc-10`. Radius `--sc-r-control` `--sc-r` `--sc-r-lg` `--sc-r-full`.
