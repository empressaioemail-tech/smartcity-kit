import * as React from "react";
import { Panel, PanelBody, PanelHead, Pill, Prov, Text } from "@empressaio/smartcity-kit";

/**
 * A resting panel is a border, not an empty rectangle. The gallery mounts
 * `{null}`; that is a class cover, not a card. Head plus a short body is the
 * composition every lens actually ships.
 */
export const DecisionQueue = () => (
  <Panel>
    <PanelHead title="What needs you today">
      <Text step="caption">Decision queue</Text>
    </PanelHead>
    <PanelBody>
      <Text step="caption" as="p">
        The queue is first-class once a permit source is granted or the pack generates
        records. Until then this panel stays empty.
      </Text>
    </PanelBody>
  </Panel>
);

export const Meetings = () => (
  <Panel>
    <PanelHead title="Public meetings">
      <Prov source="City clerk calendar" detail={<span>unread</span>} />
      <Pill meaning="warn">Partial</Pill>
    </PanelHead>
    <PanelBody>
      <Text step="caption" as="p">
        Public meetings list files records from a clerk calendar grant. No clerk source is
        granted on this pack, so this panel stays empty rather than showing another city's
        sessions.
      </Text>
    </PanelBody>
  </Panel>
);

export const Pipeline = () => (
  <Panel>
    <PanelHead title="Pipeline" sub="Cases in flight" />
    <PanelBody>
      <Text step="caption" as="p">
        Fourteen generated permit cases sit in this queue. Stage names are not invented, and
        no internal routing is shown.
      </Text>
    </PanelBody>
  </Panel>
);
