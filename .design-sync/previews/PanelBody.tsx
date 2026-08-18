import * as React from "react";
import { Panel, PanelBody, PanelHead, Pill, SourceRow, Text } from "@empressaio/smartcity-kit";

/**
 * Default padding versus flush. Flush exists so a register or table can meet
 * the panel border; an empty flush body is not a card.
 */
export const Caption = () => (
  <Panel>
    <PanelHead title="What is not an asset" />
    <PanelBody>
      <Text step="caption" as="p">
        The inventory counter stays at zero until a city records an asset.
      </Text>
    </PanelBody>
  </Panel>
);

export const Flush = () => (
  <Panel>
    <PanelHead title="Across departments" />
    <PanelBody flush>
      <SourceRow name="Adopted budget" description="Appropriations by fund and department for the current year">
        <Pill>Not connected</Pill>
      </SourceRow>
      <SourceRow
        rail="partial"
        name="Permit fee revenue"
        description="Fees assessed and collected, joined to the permit record"
      >
        <Pill meaning="warn">Partial</Pill>
      </SourceRow>
    </PanelBody>
  </Panel>
);
