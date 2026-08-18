import * as React from "react";
import {
  ColStack,
  MountNote,
  Region,
  RegionBar,
  RegionCanvas,
  ShellMain,
  ShellRegions,
  Text,
} from "@empressaio/smartcity-kit";

/**
 * The main column. Page head and the work surface nest here. Caption names
 * the slot; WithRegions is how Overview actually fills it.
 */
export const Column = () => (
  <ShellMain>
    <Text step="caption">The main column. Page head and work surface nest here.</Text>
  </ShellMain>
);

export const WithRegions = () => (
  <ShellMain>
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
  </ShellMain>
);
