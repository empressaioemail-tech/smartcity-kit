import * as React from "react";
import { ColStack, MountNote, Region, RegionCanvas } from "@empressaio/smartcity-kit";

/**
 * Honest absence on a canvas: the note states that the mount has not arrived.
 * Shown inside the region canvas, which is where the product positions it.
 */
export const MapMount = () => (
  <ColStack rail>
    <Region>
      <RegionCanvas data-stage="map">
        <MountNote>The city map mounts here.</MountNote>
      </RegionCanvas>
    </Region>
  </ColStack>
);

export const NoAssetLayer = () => (
  <ColStack rail>
    <Region>
      <RegionCanvas>
        <MountNote heading="No asset layer">
          The city outline appears here once the city is drawn.
        </MountNote>
      </RegionCanvas>
    </Region>
  </ColStack>
);
