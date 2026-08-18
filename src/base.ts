import type * as React from "react";

/**
 * The prop bag every component in this package uses: the DOM attributes minus
 * the two escape hatches.
 *
 * className is removed because a consumer attaching an arbitrary class is how
 * a design system gets forked one screen at a time, and this package exists to
 * make that unrepresentable rather than discouraged.
 *
 * style is removed for the same reason one level down: an inline declaration is
 * a value that came from nowhere, and every value in this system comes from the
 * token block.
 *
 * dangerouslySetInnerHTML is removed because it is a third way to smuggle both.
 */
export type Base<E = HTMLElement> = Omit<
  React.HTMLAttributes<E>,
  "className" | "style" | "dangerouslySetInnerHTML"
> & {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export type AnchorBase = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "style" | "dangerouslySetInnerHTML"
> & {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export type ButtonBase = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style" | "dangerouslySetInnerHTML"
> & {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export type InputBase = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className" | "style" | "dangerouslySetInnerHTML"
> & {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

/** Joins class names. The only string assembly in this package. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
