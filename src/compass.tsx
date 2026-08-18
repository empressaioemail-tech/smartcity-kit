import * as React from "react";
import type { Base, ButtonBase } from "./base";

/*
 * Compass is a source control in the top bar that presents as a shared-element
 * sheet. It is not a page, not a route, not a rail state and not a floating
 * bubble, so none of those is a prop.
 */

/**
 * The control in the top bar. The scope line is required and always visible:
 * an assistant that cannot say which city and which lens it is answering for is
 * the failure this component's shape exists to prevent.
 */
export function CompassSource({
  label = "Compass",
  scope,
  children,
  ...rest
}: ButtonBase & { label?: React.ReactNode; scope: React.ReactNode; children?: React.ReactNode }) {
  return (
    <button type="button" className="cp-source" {...rest}>
      {children}
      <span className="cp-src-l">
        <b>{label}</b>
        <em>{scope}</em>
      </span>
    </button>
  );
}

/** The ground behind the presented sheet. */
export function CompassScrim(props: Base<HTMLDivElement>) {
  return <div className="cp-scrim" {...props} />;
}

/** The sheet itself. One instance for the signed-in user, across all products. */
export function CompassSheet({
  label = "Compass",
  children,
  ...rest
}: Base<HTMLElement> & { label?: string; children?: React.ReactNode }) {
  return (
    <aside className="cp-sheet" aria-label={label} {...rest}>
      {children}
    </aside>
  );
}

export function CompassInner({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="cp-inner" {...rest}>
      {children}
    </div>
  );
}

/** The sheet head, carrying the drag affordance and the close control. */
export function CompassHead({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="cp-head" {...rest}>
      {children}
    </div>
  );
}

/** The drag affordance. */
export function CompassGrab(props: Base<HTMLSpanElement>) {
  return <span className="cp-grab" {...props} />;
}

/** The mandatory always-visible scope line: which city, which lens. */
export function CompassScope({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="cp-scope" {...rest}>
      {children}
    </div>
  );
}

export function CompassThread({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="cp-thread" {...rest}>
      {children}
    </div>
  );
}

/** One turn in the thread. */
export function CompassTurn({ children, ...rest }: Base<HTMLParagraphElement> & { children?: React.ReactNode }) {
  return (
    <p className="cp-turn" {...rest}>
      {children}
    </p>
  );
}

/** A note about what the assistant cannot do. Quieter than a turn, on purpose. */
export function CompassNote({ children, ...rest }: Base<HTMLParagraphElement> & { children?: React.ReactNode }) {
  return (
    <p className="cp-note" {...rest}>
      {children}
    </p>
  );
}
