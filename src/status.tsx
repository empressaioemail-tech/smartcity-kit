import * as React from "react";
import { cx } from "./base";
import type { AnchorBase, Base } from "./base";

/* -------------------------------------------------------------------- pill */

/**
 * The six semantic meanings, and nothing else.
 *
 * The system's third law is quiet on satisfied, loud on unresolved: Pass is
 * gray and unresolved carries the strongest treatment on the page. An API that
 * makes it easy to render a satisfied thing loudly has encoded the inverse of
 * that law, so three things are true of this component and are tested.
 *
 * One. The prop is `meaning`, not variant, tone, colour or status. It names
 * what the pill claims, not how loud it is.
 *
 * Two. It DEFAULTS to quiet. Omission is the quietest form, so the cheapest
 * thing to write is the thing the law wants.
 *
 * Three. There is no emphasis, filled, solid, strong or size prop. A pill
 * cannot be made louder than its meaning, because there is no lever.
 */
export type Meaning = "ok" | "info" | "warn" | "crit" | "restricted" | "quiet";

const PILL_CLASS: Record<Meaning, string> = {
  ok: "p-ok",
  info: "p-info",
  warn: "p-warn",
  crit: "p-crit",
  restricted: "p-restricted",
  quiet: "p-quiet",
};

export function Pill({
  meaning = "quiet",
  children,
  ...rest
}: Base<HTMLSpanElement> & { meaning?: Meaning; children?: React.ReactNode }) {
  return (
    <span className={cx("pill", PILL_CLASS[meaning])} {...rest}>
      {children}
    </span>
  );
}

/* -------------------------------------------------------------- provenance */

/**
 * A SECOND claim on one provenance chip.
 *
 * G-93 split the navigation footer figure in two, and the product stated why in
 * the markup it ships: "TWO FIGURES, BECAUSE THEY ARE TWO CLAIMS. A granted
 * source is connected; a demonstrated kind is generated fixture data that
 * connects nothing." Both members are REQUIRED, and that is the whole point of
 * making this a pair rather than two loose props. A second figure is a second
 * number on the same chip, and a number whose counting rule is optional is a
 * number that will eventually ship without one.
 */
export type ProvClaim = {
  /** The bold figure or label for this claim. */
  source: React.ReactNode;
  /** This claim's own counting rule or read state. Not optional. */
  detail: React.ReactNode;
};

type ProvOneClaim = {
  source: React.ReactNode;
  detail?: React.ReactNode;
  secondClaim?: never;
  href?: string;
};

type ProvTwoClaims = {
  source: React.ReactNode;
  /** Required on this arm: a chip cannot carry a second counting rule and no first one. */
  detail: React.ReactNode;
  secondClaim: ProvClaim;
  href?: string;
};

export type ProvProps = (Base<HTMLSpanElement> | AnchorBase) & (ProvOneClaim | ProvTwoClaims);

/**
 * The provenance chip: where a value came from, and when it was read.
 *
 * `source` is required and renders inside the bold slot, so there is no shape
 * of this component that puts a value on screen with no label attached to it.
 * `detail` is the read state or the counting rule and renders after the
 * separator, which is how the product carries "unread", a last-read time, or
 * "Homes-table row" beside a count.
 *
 * `detail` is rendered AS GIVEN rather than wrapped, because the shipped chip is
 * not uniform: five instances carry bare text after the separator, one carries a
 * single span, and the navigation footer carries two. Wrapping would have made
 * the component render markup the product does not have, which is the one thing
 * a wrapper must never do.
 *
 * Renders an anchor when `href` is given, matching the product, where the
 * navigation footer chip links into the register it counts.
 *
 * TWO CLAIMS, AND THE ORDER THEY PAINT IN. `secondClaim` adds a second bold
 * figure. The emitted order is
 *
 *     <b>source</b> | <b>secondClaim.source</b> | detail | secondClaim.detail
 *
 * so the two figures sit together at the head of the chip and the two counting
 * rules sit together at the tail. THIS IS NOT THE ORDER THE PROPS READ IN, and
 * it is deliberate: it is the order smartcity-dashboards ships at
 * `web/index.html` `.nav-foot .prov`, and `.prov` is `display:inline-flex` with
 * a flat gap, so DOM order is paint order and a wrapper that tidied it into
 * figure-rule-figure-rule would be rendering markup the product does not have.
 * Held by `test/law.test.mjs`, by a markup-parity case against the shipped
 * chip, and by `scripts/prove-gates.mjs` injections, not by this comment.
 *
 * What this component REFUSES, by shape rather than by review:
 *
 *   - a second figure with no counting rule of its own. `ProvClaim.detail` is
 *     required.
 *   - a second figure while the first has none. `detail` is required on the
 *     two-claim arm of the union, so `<Prov source secondClaim>` does not
 *     compile.
 *   - a third claim. There is no prop for one and the product ships none, so a
 *     case built on it could never fail for the right reason.
 *   - re-ordering the interleave. The order is emitted, never passed in.
 */
export function Prov(props: ProvProps) {
  const { source, detail, secondClaim, href, ...rest } = props as ProvProps & {
    detail?: React.ReactNode;
    secondClaim?: ProvClaim;
  };
  const inner = (
    <>
      <b>{source}</b>
      {secondClaim === undefined ? null : (
        <>
          {" "}
          <span className="sep">|</span> <b>{secondClaim.source}</b>
        </>
      )}
      {detail === undefined ? null : (
        <>
          {" "}
          <span className="sep">|</span> {detail}
        </>
      )}
      {secondClaim === undefined ? null : (
        <>
          {" "}
          <span className="sep">|</span> {secondClaim.detail}
        </>
      )}
    </>
  );
  if (href !== undefined) {
    return (
      <a className="prov" href={href} {...(rest as AnchorBase)}>
        {inner}
      </a>
    );
  }
  return (
    <span className="prov" {...(rest as Base<HTMLSpanElement>)}>
      {inner}
    </span>
  );
}

/* ------------------------------------------------------------------- basis */

/**
 * The basis line. It states what a value or an absence rests on.
 *
 * The component writes the "Basis:" prefix itself, so the prop is the statement
 * and not the whole sentence. A basis line that does not announce itself as one
 * is not representable, which is the same shape the product's own renderer uses
 * when it writes a basis from a record.
 */
export function Basis({ children, ...rest }: Base<HTMLSpanElement> & { children: React.ReactNode }) {
  return (
    <span className="basis" {...rest}>
      Basis: {children}
    </span>
  );
}

/* --------------------------------------------------------- environment set */

/** The city seal. Two or three mono characters, never an uploaded logo. */
export function Seal({ children, ...rest }: Base<HTMLSpanElement> & { children?: React.ReactNode }) {
  return (
    <span className="seal" {...rest}>
      {children}
    </span>
  );
}

/** City name in the top bar. The only product identity in the chrome. */
export function BrandCity({
  children,
  qualifier,
  ...rest
}: Base<HTMLSpanElement> & { children: React.ReactNode; qualifier?: React.ReactNode }) {
  return (
    <span className="brandcity" {...rest}>
      {children}
      {qualifier === undefined ? null : <span>{qualifier}</span>}
    </span>
  );
}

/**
 * The environment badge. Three identities must never render alike, which is why
 * `environment` is required: there is no default, because defaulting would let a
 * demo fixture render as live by omission.
 */
export function EnvBadge({
  environment,
  children,
  ...rest
}: Base<HTMLSpanElement> & {
  environment: "demo" | "live" | "staging";
  children: React.ReactNode;
}) {
  return (
    <span className={cx("env", environment === "demo" && "demo")} {...rest}>
      {children}
    </span>
  );
}
