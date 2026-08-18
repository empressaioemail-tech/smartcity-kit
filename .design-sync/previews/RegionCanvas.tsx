import * as React from "react";
import { ColStack, MountNote, Region, RegionCanvas } from "@empressaio/smartcity-kit";

/**
 * Map ground and document ground, each with the mount note the product shows
 * when the iframe has not arrived. The rail stack is the shipped height home.
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

export const DocMount = () => (
  <ColStack rail>
    <Region>
      <RegionCanvas ground="doc" data-stage="review">
        <MountNote>The review console mounts here.</MountNote>
      </RegionCanvas>
    </Region>
  </ColStack>
);
