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
 */
export function Prov({
  source,
  detail,
  href,
  ...rest
}: (Base<HTMLSpanElement> | AnchorBase) & {
  source: React.ReactNode;
  detail?: React.ReactNode;
  href?: string;
}) {
  const inner = (
    <>
      <b>{source}</b>
      {detail === undefined ? null : (
        <>
          {" "}
          <span className="sep">|</span> {detail}
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
