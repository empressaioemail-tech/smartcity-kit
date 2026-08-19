import * as React from "react";
import { cx } from "./base";
import type { AnchorBase, Base, ButtonBase } from "./base";
import { Basis } from "./status";

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

/* ------------------------------------------------------------ top-bar menus */

/*
 * The top-bar menu family, shipped by the product at G-90.
 *
 * Four classes and they are the smallest set a dropdown needs: an anchor a
 * panel can be positioned against, the panel, a group inside it, and a row.
 * Everything else composes classes this package already wraps, and that is a
 * fact about the stylesheet rather than a choice made here: shell.css says so
 * in its own header, and .pop is only ever written .panel.pop.
 *
 * One rule travels with this family and it is the product's own. shell.css, at
 * .pop-item[disabled]: "An unavailable entry reads as unavailable rather than
 * merely unresponsive. Its reason is the .basis line its group carries, filled
 * from the server." index.html, above the block: "a control that has not yet
 * heard from the server must not look available." That is honest absence stated
 * about a control instead of about a panel, and PopItem below holds it at the
 * type.
 */

/**
 * The anchor a top-bar dropdown is positioned against.
 *
 * It has no open state and no trigger slot, because the product's two shipped
 * instances differ in what they wrap and agree only on the wrapping. A trigger
 * prop would have made this a menu widget with an opinion about focus, keyboard
 * handling and dismissal, none of which is a class this stylesheet ships, and a
 * package that owns no styling should not grow behaviour it cannot express in
 * the vocabulary it wraps.
 */
export function TopMenu({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="topmenu" {...rest}>
      {children}
    </div>
  );
}

/**
 * The dropdown panel. Always a panel: the product writes `panel pop` on every
 * instance and .pop declares no border, background or radius of its own, so a
 * bare .pop would render as an unframed floating block. It is emitted as the
 * pair rather than offered as a composition, because the pair is the shipped
 * fact and the unpaired form is a bug waiting for a consumer to find.
 *
 * `label` is required. Both shipped instances carry role=group and an
 * aria-label, and a popover the assistive layer cannot name is a panel that
 * exists for sighted users only.
 *
 * `open` defaults to CLOSED, which is the quiet default the third law asks for
 * and also the state the product ships in its static document. A panel that
 * opened by omission would put the loudest thing on the page one forgotten prop
 * away.
 */
export function Pop({
  label,
  open = false,
  children,
  ...rest
}: Base<HTMLDivElement> & { label: string; open?: boolean; children?: React.ReactNode }) {
  return (
    <div className="panel pop" role="group" aria-label={label} hidden={!open} {...rest}>
      {children}
    </div>
  );
}

/**
 * A group of entries inside a popover.
 *
 * `basis` is the group's own reason line and it is optional, because the product
 * ships the reason in two places and both are real: three of the five shipped
 * groups carry one trailing basis for the whole group, and two carry a basis per
 * entry. Requiring it here would have made the per-entry form unrepresentable
 * and forced a second basis nobody asked for onto every group that already
 * states its reasons row by row. The requirement lives on PopItem instead, where
 * it is a rule about a control rather than a rule about a container.
 */
export function PopGroup({
  basis,
  children,
  ...rest
}: Base<HTMLDivElement> & { basis?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="pop-group" {...rest}>
      {children}
      {basis === undefined ? null : <Basis>{basis}</Basis>}
    </div>
  );
}

/**
 * One entry in a popover, and THERE IS NO `disabled` PROP.
 *
 * That absence is the enforcement mechanism. `disabled` is removed from the prop
 * bag, so the only way to render an unavailable entry is `unavailable`, and
 * `unavailable` IS the reason: it is the basis text, not a flag. An entry cannot
 * be greyed out without saying why, because there is no prop that greys it out.
 *
 * The rule is the product's, quoted in the family header above, and every one of
 * the seven entries smartcity-dashboards ships today is unavailable with a
 * stated basis. The failure this closes is the one the product's own comment
 * names: an entry that is merely unresponsive, which reads as a broken button
 * rather than as a capability the server has not confirmed.
 *
 * `test/law.test.mjs` asserts the removal is still in this source and
 * `test/consumer.test.mjs` watches the compiler reject `disabled` on the
 * offending line, so the rule survives an edit that only looks harmless.
 */
export function PopItem({
  unavailable,
  children,
  ...rest
}: Omit<ButtonBase, "disabled"> & { unavailable?: React.ReactNode; children?: React.ReactNode }) {
  if (unavailable === undefined) {
    return (
      <button type="button" className="pop-item" {...rest}>
        {children}
      </button>
    );
  }
  return (
    <>
      <button type="button" className="pop-item" disabled {...rest}>
        {children}
      </button>
      <Basis>{unavailable}</Basis>
    </>
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
