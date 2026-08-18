import * as React from "react";
import { ColStack, MountNote, Region, RegionBar, RegionCanvas, ShellRegions, Text } from "@empressaio/smartcity-kit";

/**
 * The work surface. Two columns by default, primary region plus context rail;
 * solo is the single-column form the product uses when there is no rail.
 */
export const TwoColumn = () => (
  <ShellRegions>
    <ColStack>
      <Text step="caption">The panel column.</Text>
    </ColStack>
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
  </ShellRegions>
);

export const Solo = () => (
  <ShellRegions solo>
    <ColStack>
      <Text step="caption">The single-column form. No rail.</Text>
    </ColStack>
  </ShellRegions>
);
