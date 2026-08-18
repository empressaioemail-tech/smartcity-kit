import * as React from "react";
import { ColStack, MountNote, Panel, PanelBody, PanelHead, Region, RegionBar, RegionCanvas, Text } from "@empressaio/smartcity-kit";

/**
 * A scrolling column of panels. Default is the Overview panel column; rail
 * marks the column that holds the map.
 */
export const Panels = () => (
  <ColStack>
    <Panel>
      <PanelHead title="What needs you today">
        <Text step="caption">Decision queue</Text>
      </PanelHead>
      <PanelBody>
        <Text step="caption">Counts wait on a source read. This column scrolls; panels keep their height.</Text>
      </PanelBody>
    </Panel>
  </ColStack>
);

export const Rail = () => (
  <ColStack rail>
    <Region>
      <RegionBar title="The city">
        <Text step="caption">SmartSite</Text>
      </RegionBar>
      <RegionCanvas>
        <MountNote>The city map mounts here.</MountNote>
      </RegionCanvas>
    </Region>
  </ColStack>
);
