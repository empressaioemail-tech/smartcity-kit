import * as React from "react";
import { Metric, MetricStrip } from "@empressaio/smartcity-kit";

/**
 * The strip carries four figures and never a bare one. Unread says so in words
 * rather than showing a zero, because a zero here is a claim the city has not
 * made; a counted figure travels with the denominator it was counted from.
 */
export const Counted = () => (
  <MetricStrip>
    <Metric label="Overdue" value="3" note="of 14 generated cases in flight" />
    <Metric label="In review" value="5" note="of 14 generated cases in flight" />
    <Metric label="Awaiting applicant" value="4" note="of 14 generated cases in flight" />
    <Metric label="Ready to issue" value="2" note="of 14 generated cases in flight" />
  </MetricStrip>
);

export const Unread = () => (
  <MetricStrip>
    <Metric label="Needs a decision" unread="Not read" note="No operations source" />
    <Metric label="Overdue reviews" unread="Not read" note="Review mount is preview" />
    <Metric label="Permits in flight" unread="Not read" note="No permit source" />
    <Metric label="Meetings this week" unread="Not read" note="No clerk source" />
  </MetricStrip>
);
