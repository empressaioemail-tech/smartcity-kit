import * as React from "react";
import { Panel, PanelHead, Pill, Prov, Text } from "@empressaio/smartcity-kit";

/**
 * Title is the head step, children trail after the flex gap, and `sub` is the
 * secondary line. Mounted inside a panel so the faint rule under the head is
 * the one the product draws.
 */
export const DecisionQueue = () => (
  <Panel>
    <PanelHead title="What needs you today">
      <Text step="caption">Decision queue</Text>
    </PanelHead>
  </Panel>
);

export const Meetings = () => (
  <Panel>
    <PanelHead title="Public meetings">
      <Prov source="City clerk calendar" detail={<span>unread</span>} />
      <Pill meaning="warn">Partial</Pill>
    </PanelHead>
  </Panel>
);

export const Pipeline = () => (
  <Panel>
    <PanelHead title="Pipeline" sub="Cases in flight" />
  </Panel>
);
