import * as React from "react";
import { MountNote, TabPanel, Text } from "@empressaio/smartcity-kit";

/**
 * Two independent tab sets, both shown active so the card is not `display:none`.
 * Pipeline keeps the unread caption; Assets keeps the map placeholder copy.
 */
export const Pipeline = () => (
  <TabPanel group="development-services" active>
    <Text step="caption">Cases in flight</Text>
    <Text step="caption">No cases are in flight on this pack.</Text>
  </TabPanel>
);

export const Assets = () => (
  <TabPanel group="assets" active>
    <Text step="caption">City outline, no asset layer</Text>
    <MountNote heading="No asset layer">
      The city outline appears here once the city is drawn.
    </MountNote>
  </TabPanel>
);
