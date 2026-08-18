import * as React from "react";
import { cx } from "./base";
import type { AnchorBase, Base } from "./base";

/* ------------------------------------------------------------------- frame */

/** The application frame. One shell, one navigation, one accent. */
export function Shell({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="shell" {...rest}>
      {children}
    </div>
  );
}

/**
 * Everything the assistant sheet recedes behind. It exists so the sheet can be
 * a shared-element transition rather than a layer dropped on top of the page,
 * and it wraps the whole shell body in the product.
 */
export function ShellRecede({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="cp-recede" {...rest}>
      {children}
    </div>
  );
}

/** The top bar. It carries which city, which environment, search, and who you are. */
export function ShellTop({ children, ...rest }: Base<HTMLElement> & { children?: React.ReactNode }) {
  return (
    <header className="shell-top" {...rest}>
      {children}
    </header>
  );
}

export function ShellBody({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="shell-body" {...rest}>
      {children}
    </div>
  );
}

/** The sidebar. `open` is the narrow-viewport sheet state. */
export function ShellNav({
  open,
  label = "Primary",
  children,
  ...rest
}: Base<HTMLElement> & { open?: boolean; label?: string; children?: React.ReactNode }) {
  return (
    <nav className={cx("shell-nav", open && "open")} aria-label={label} {...rest}>
      {children}
    </nav>
  );
}

export function ShellMain({ children, ...rest }: Base<HTMLElement> & { children?: React.ReactNode }) {
  return (
    <main className="shell-main" {...rest}>
      {children}
    </main>
  );
}

/**
 * The work surface. Two columns by default, primary region plus context rail;
 * `solo` is the single-column form the product uses when there is no rail.
 */
export function ShellRegions({
  solo,
  children,
  ...rest
}: Base<HTMLDivElement> & { solo?: boolean; children?: React.ReactNode }) {
  return (
    <div className={cx("shell-regions", solo && "solo")} {...rest}>
      {children}
    </div>
  );
}

/** A scrolling column of panels. `rail` marks the column that holds the map. */
export function ColStack({
  rail,
  children,
  ...rest
}: Base<HTMLDivElement> & { rail?: boolean; children?: React.ReactNode }) {
  return (
    <div className={cx("colstack", rail && "rail")} {...rest}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------- navigation */

export function NavGroup({
  label,
  children,
  ...rest
}: Base<HTMLDivElement> & { label?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="navgroup" {...rest}>
      {label === undefined ? null : <div className="gl">{label}</div>}
      {children}
    </div>
  );
}

/**
 * A navigation item.
 *
 * `state` is one of three, and the two quiet ones exist so the roster can stay
 * honest: `roster` is a department that is named and dim, `unbuilt` is a lens
 * that is named and not interactive. Hiding either behind an overflow menu is
 * how a product implies coverage it does not have.
 *
 * `badge` is the state word. It is not a count and there is no count prop,
 * because a count with no source read is the zero-theatre this system refuses.
 */
export type NavState = "default" | "roster" | "unbuilt";

export function NavItem({
  active,
  state = "default",
  badge,
  children,
  ...rest
}: AnchorBase & {
  active?: boolean;
  state?: NavState;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <a
      className={cx(
        "navitem",
        active && "on",
        state === "roster" && "roster",
        state === "unbuilt" && "unbuilt",
      )}
      {...rest}
    >
      {children}
      {badge === undefined ? null : (
        <>
          <span className="grow" />
          <span className="badge">{badge}</span>
        </>
      )}
    </a>
  );
}

/** The navigation footer. The product puts connection reality here, as text. */
export function NavFoot({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="nav-foot" {...rest}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------- page header */

export function PageHead({ children, ...rest }: Base<HTMLElement> & { children?: React.ReactNode }) {
  return (
    <header className="pagehead" {...rest}>
      {children}
    </header>
  );
}

/** The breadcrumb. Bold segments are the ones that name a subject. */
export function Crumb({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="crumb" {...rest}>
      {children}
    </div>
  );
}

/** The page title and everything that sits on its line. */
export function TitleRow({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="titlerow" {...rest}>
      {children}
    </div>
  );
}

/** The one-line statement under a page title. */
export function Lede({ children, ...rest }: Base<HTMLParagraphElement> & { children?: React.ReactNode }) {
  return (
    <p className="lede" {...rest}>
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------- routing */

/** A lens: one department view inside the shell. Only the active one renders. */
export function Lens({
  active,
  children,
  ...rest
}: Base<HTMLElement> & { active?: boolean; children?: React.ReactNode }) {
  return (
    <section className={cx("lens", active && "on")} {...rest}>
      {children}
    </section>
  );
}

/**
 * A tab panel inside a lens. `group` names which tab set it belongs to, because
 * the product ships two independent sets and they are separate classes.
 */
export function TabPanel({
  group,
  active,
  children,
  ...rest
}: Base<HTMLDivElement> & {
  group: "development-services" | "assets";
  active?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cx(group === "assets" ? "assets-tab" : "ds-tab", active && "on")}
      {...rest}
    >
      {children}
    </div>
  );
}
