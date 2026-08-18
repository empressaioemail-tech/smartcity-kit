import * as React from "react";
import { cx } from "./base";
import type { Base } from "./base";

/* ------------------------------------------------------------------ region */

/**
 * A map or document region: bar, canvas, footer, inside our border and our page
 * header. A surface that cannot render in this frame with this header is not
 * ready to ship, which is why there is no full-bleed or chromeless prop.
 */
export function Region({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="region" {...rest}>
      {children}
    </div>
  );
}

/** The region bar. `title` sets in the mono label step, as the product does. */
export function RegionBar({
  title,
  children,
  ...rest
}: Base<HTMLDivElement> & { title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="region-bar" {...rest}>
      <span className="t">{title}</span>
      {children === undefined ? null : (
        <>
          <span className="grow" />
          {children}
        </>
      )}
    </div>
  );
}

/**
 * The canvas. `ground` picks which of the two grounds the token block declares:
 * the map ground or the document ground. There is no colour prop, because the
 * ground is a token and the data layers carry the only saturation on the screen.
 */
export function RegionCanvas({
  ground = "map",
  children,
  ...rest
}: Base<HTMLDivElement> & { ground?: "map" | "doc"; children?: React.ReactNode }) {
  return (
    <div className={cx("region-canvas", ground === "doc" && "doc")} {...rest}>
      {children}
    </div>
  );
}

/** Selection detail renders here or in the context rail, never over the canvas. */
export function RegionFoot({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="region-foot" {...rest}>
      {children}
    </div>
  );
}

/**
 * What a reader sees if the mount never arrives. It states that, rather than
 * leaving an empty rectangle, which is the honest-absence law applied to a
 * region that had nothing to draw.
 */
export function MountNote({
  heading,
  children,
  ...rest
}: Base<HTMLSpanElement> & { heading?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <span className="mount-note" {...rest}>
      {heading === undefined ? null : <b className="t-data">{heading}</b>}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------- stage */

/**
 * The mount stage: one persistent frame per mounted product, positioned over
 * whichever anchor is visible. `state` is the presentation step, and the two
 * loud states are opt-in.
 */
export function Stage({
  ground = "map",
  state = "anchored",
  children,
  ...rest
}: Base<HTMLDivElement> & {
  ground?: "map" | "doc";
  state?: "anchored" | "presented" | "max";
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "stage",
        ground === "doc" && "doc",
        state === "presented" && "is-presented",
        state === "max" && "is-max",
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/** The ground behind a presented stage. */
export function StageScrim(props: Base<HTMLDivElement>) {
  return <div className="stage-scrim" {...props} />;
}

/** The escape affordance shown while a stage is presented. */
export function StageEsc({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="stage-esc" {...rest}>
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------- citizen */

/** The scrolling ground for the citizen lens. Scoped light inside a dark session. */
export function CitizenScroll({
  theme = "light",
  children,
  ...rest
}: Base<HTMLDivElement> & { theme?: "light" | "dark"; children?: React.ReactNode }) {
  return (
    <div className={cx("cz-scroll", theme === "light" ? "sc-light" : "sc-dark")} {...rest}>
      {children}
    </div>
  );
}

/** The single reading column. Citizen is a lens, not a separate product. */
export function CitizenColumn({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="cz" {...rest}>
      {children}
    </div>
  );
}

/** The address lookup row on the citizen lens. */
export function CitizenLookup({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="citizen-lookup" {...rest}>
      {children}
    </div>
  );
}
