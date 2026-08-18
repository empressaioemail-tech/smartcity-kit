import * as React from "react";
import { cx } from "./base";
import type { AnchorBase, Base } from "./base";
import { Grow } from "./primitives";
import { Basis } from "./status";

/* ------------------------------------------------------------------- panel */

/**
 * A resting panel. It is defined by its border, and it has no elevation,
 * shadow or raised prop: the system's elevation ruling says a resting panel
 * carries no shadow in either theme, and a prop that could set one would be a
 * settled decision reopened as a style option.
 */
export function Panel({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="panel" {...rest}>
      {children}
    </div>
  );
}

/**
 * The panel head. `title` is the head step, `sub` the secondary line, and
 * children are the trailing controls, which the product separates from the
 * title with a flexible gap. The gap is emitted only when there is something to
 * push, matching the shipped markup rather than improving on it.
 */
export function PanelHead({
  title,
  sub,
  children,
  ...rest
}: Base<HTMLDivElement> & {
  title: React.ReactNode;
  sub?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="panel-head" {...rest}>
      <span className="t">{title}</span>
      {sub === undefined ? null : <span className="sub">{sub}</span>}
      {children === undefined ? null : (
        <>
          <Grow />
          {children}
        </>
      )}
    </div>
  );
}

/** The panel body. `flush` removes the padding so a table or register can meet the border. */
export function PanelBody({
  flush,
  children,
  ...rest
}: Base<HTMLDivElement> & { flush?: boolean; children?: React.ReactNode }) {
  return (
    <div className={cx("panel-body", flush && "flush")} {...rest}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------- tabs */

/** Switches content within a surface. It never changes which record you are on. */
export function Tabs({
  label,
  children,
  ...rest
}: Base<HTMLDivElement> & { label: string; children?: React.ReactNode }) {
  return (
    <div className="tabs" role="tablist" aria-label={label} {...rest}>
      {children}
    </div>
  );
}

/** One tab. Renders an anchor, as the product does, so a tab is a real address. */
export function Tab({
  selected = false,
  children,
  ...rest
}: AnchorBase & { selected?: boolean; children?: React.ReactNode }) {
  return (
    <a role="tab" aria-selected={selected ? "true" : "false"} {...rest}>
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ states */

/**
 * The four absence states share one component, because the thing that makes an
 * absence honest is not which of the four it is: it is that a basis travels
 * with it.
 *
 * `kicker`, `heading` and `basis` are all required. An absence with no stated
 * basis is a type error rather than a review comment, which is the only way a
 * rule of this kind survives contact with a design agent.
 */
export function State({
  kicker,
  heading,
  basis,
  compact,
  children,
  ...rest
}: Base<HTMLDivElement> & {
  kicker: React.ReactNode;
  heading: React.ReactNode;
  basis: React.ReactNode;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={cx("state", compact && "compact")} {...rest}>
      <span className="st-k">{kicker}</span>
      <h5>{heading}</h5>
      {children === undefined ? null : <p>{children}</p>}
      <Basis>{basis}</Basis>
    </div>
  );
}

/* ------------------------------------------------------------------ metric */

/**
 * A metric tile, as a discriminated union with no third shape.
 *
 * Either the tile has a value, or it states in words that nothing was read.
 * There is no arm that renders a number alone, and there is no arm that lets an
 * unknown render as a zero, because a zero here would be a claim the city has
 * not made.
 *
 * `note` is required on BOTH arms. On the value arm it is the counting rule
 * that travels with the number; on the unread arm it is why nothing was read.
 */
export type MetricProps = Base<HTMLDivElement> & { label: React.ReactNode; note: React.ReactNode } & (
    | { value: React.ReactNode; unread?: never }
    | { unread: React.ReactNode; value?: never }
  );

export function Metric(props: MetricProps) {
  const { label, note, ...rest } = props as MetricProps & {
    value?: React.ReactNode;
    unread?: React.ReactNode;
  };
  const hasValue = "value" in props && props.value !== undefined;
  const { value, unread, ...dom } = rest as {
    value?: React.ReactNode;
    unread?: React.ReactNode;
  } & Base<HTMLDivElement>;
  return (
    <div className={cx("metric", hasValue && "has-value")} {...dom}>
      <span className="k">{label}</span>
      <span className={cx("v", !hasValue && "word")}>{hasValue ? value : unread}</span>
      <span className="n">{note}</span>
    </div>
  );
}

/** The metric strip. The only place metrics appear on a work surface. */
export function MetricStrip({
  children,
  ...rest
}: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="metrics" {...rest}>
      {children}
    </div>
  );
}
