import * as React from "react";
import { PopItem } from "@empressaio/smartcity-kit";

/**
 * An available entry. Quiet, and it gets nothing extra to be quiet.
 */
export const Available = () => <PopItem>Sign in</PopItem>;

/**
 * An unavailable entry, and there is no way to draw one without saying why.
 *
 * There is no disabled prop. It is removed from the prop bag, so the only way
 * to grey an entry out is the reason itself: the prop is not a flag, it is the
 * basis text. An entry that is merely unresponsive reads as a broken button
 * rather than as a capability the server has not confirmed, and that is the
 * failure this closes.
 */
export const Unavailable = () => (
  <>
    <PopItem unavailable="not read">Sign in</PopItem>
    <PopItem unavailable="not read">Sign out</PopItem>
  </>
);
