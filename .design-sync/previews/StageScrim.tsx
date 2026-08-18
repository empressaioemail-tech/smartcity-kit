import * as React from "react";
import { ColStack, MountNote, Region, RegionBar, RegionCanvas, StageScrim, Text } from "@empressaio/smartcity-kit";

/**
 * The ground behind a presented stage. Solo it is 0.34 canvas on a canvas
 * card. The product lays it over the map region, so the card does too. The
 * rail stack is the shipped height home; without it the canvas collapses and
 * the wash has nothing to recede.
 */
export const Ground = () => (
  <>
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
    <StageScrim />
  </>
);
