import * as React from "react";
import { Metric } from "@empressaio/smartcity-kit";

/**
 * A metric is a discriminated union: a value with its counting rule, or unread
 * in words. The floor card mounted the name only. Unread tiles and counted
 * tiles are both required, and a zero is never a substitute for unread.
 */
export const Unread = () => (
  <>
    <Metric label="Needs a decision" unread="Not read" note="No operations source" />
    <Metric label="Overdue reviews" unread="Not read" note="Review mount is preview" />
    <Metric label="Permits in flight" unread="Not read" note="No permit source" />
    <Metric label="Meetings this week" unread="Not read" note="No clerk source" />
  </>
);

export const Counted = () => (
  <>
    <Metric label="Overdue" value="3" note="of 14 generated cases in flight" />
    <Metric label="In review" value="5" note="of 14 generated cases in flight" />
    <Metric label="Awaiting applicant" value="4" note="of 14 generated cases in flight" />
    <Metric label="Ready to issue" value="2" note="of 14 generated cases in flight" />
  </>
);
