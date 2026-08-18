import * as React from "react";
import { cx } from "./base";
import type { AnchorBase, Base, ButtonBase, InputBase } from "./base";

/* ------------------------------------------------------------------- theme */

/**
 * Forces a subtree onto one theme, which is how a light citizen surface renders
 * inside a dark staff session. Both values are the classes the token file
 * declares; there is no third.
 */
export function Theme({
  mode,
  children,
  ...rest
}: Base<HTMLDivElement> & { mode: "light" | "dark"; children?: React.ReactNode }) {
  return (
    <div className={mode === "light" ? "sc-light" : "sc-dark"} {...rest}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------- type */

/**
 * The three type steps the stylesheet ships. There is deliberately no size
 * prop and no numeric step: an off-ramp size is unrepresentable rather than
 * discouraged, which is the only form of the type-ramp floor a wrapper can enforce.
 *
 * label  - mono, uppercase, tracked. Field and section labels.
 * caption - metadata.
 * data   - identifiers, dates, money. Tabular figures.
 */
export type TextStep = "label" | "caption" | "data";

const TEXT_CLASS: Record<TextStep, string> = {
  label: "t-label",
  caption: "t-caption",
  data: "t-data",
};

export function Text({
  step,
  as = "span",
  children,
  ...rest
}: Base & { step: TextStep; as?: "span" | "p" | "div"; children?: React.ReactNode }) {
  return React.createElement(as, { className: TEXT_CLASS[step], ...rest }, children);
}

/* ----------------------------------------------------------------- spacers */

/**
 * The flexible gap between a title and its trailing controls.
 *
 * `as` exists because the product ships both forms: a span inside a panel head
 * and a div in the top bar. Matching the shipped markup means offering both, and
 * this is a wrapper, not an improvement pass.
 */
export function Grow({ as = "span", ...rest }: Base & { as?: "span" | "div" }) {
  return React.createElement(as, { className: "grow", ...rest });
}

/** The flexible gap inside a page-header title row. */
export function Fill(props: Base<HTMLSpanElement>) {
  return <span className="fill" {...props} />;
}

/* ----------------------------------------------------------------- buttons */

export type ButtonKind = "default" | "primary" | "ghost";
export type ButtonSize = "default" | "sm";

const BUTTON_KIND: Record<ButtonKind, string | false> = {
  default: false,
  primary: "btn-primary",
  ghost: "btn-ghost",
};

/**
 * One primary per region, naming the outcome. `kind` defaults to default rather
 * than primary so a screen full of primaries takes an explicit act to build.
 */
export function Button({
  kind = "default",
  size = "default",
  children,
  ...rest
}: ButtonBase & { kind?: ButtonKind; size?: ButtonSize; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      className={cx("btn", BUTTON_KIND[kind], size === "sm" && "btn-sm")}
      {...rest}
    >
      {children}
    </button>
  );
}

/** A button rendered as a link, which the product uses for cross-surface moves. */
export function ButtonLink({
  kind = "default",
  size = "default",
  children,
  ...rest
}: AnchorBase & { kind?: ButtonKind; size?: ButtonSize; children?: React.ReactNode }) {
  return (
    <a className={cx("btn", BUTTON_KIND[kind], size === "sm" && "btn-sm")} {...rest}>
      {children}
    </a>
  );
}

/** The narrow-viewport navigation toggle. Hidden by the stylesheet above the breakpoint. */
export function MenuButton({ children = "Menu", ...rest }: ButtonBase & { children?: React.ReactNode }) {
  return (
    <button type="button" className="btn btn-ghost menu-btn" {...rest}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ inputs */

export function Input(props: InputBase) {
  return <input className="inp" {...props} />;
}

/**
 * The search field. `notBuilt` renders the inline badge the product uses to say
 * a control is chrome, and it is a separate prop from `disabled` on purpose: a
 * disabled control with no badge is silent about why, and silence is the thing
 * the honest-absence law forbids.
 */
export function SearchField({
  icon,
  notBuilt,
  children,
  ...rest
}: Base<HTMLDivElement> & {
  icon?: React.ReactNode;
  notBuilt?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="searchwrap" {...rest}>
      {icon}
      {children}
      {notBuilt ? <span className="badge-off">{notBuilt}</span> : null}
    </div>
  );
}
