import * as React from "react";
import { PopGroup, PopItem } from "@empressaio/smartcity-kit";

/**
 * A group of entries, with the reason stated once for the whole group. This is
 * the form the shipped account menu uses where several entries are waiting on
 * the same answer from the server.
 */
export const SharedReason = () => (
  <PopGroup basis="not read">
    <PopItem>My account</PopItem>
    <PopItem>My profile</PopItem>
    <PopItem>Account settings</PopItem>
  </PopGroup>
);

/**
 * And the other shipped form, with the reason stated per entry. Both are real,
 * which is why the group's own basis is optional: requiring it would have
 * forced a second reason line onto every group that already states its reasons
 * row by row.
 *
 * The requirement lives on the entry instead, where it is a rule about a
 * control rather than a rule about a container.
 */
export const ReasonPerEntry = () => (
  <PopGroup>
    <PopItem unavailable="not read">Support</PopItem>
    <PopItem unavailable="not read">Feedback</PopItem>
  </PopGroup>
);
