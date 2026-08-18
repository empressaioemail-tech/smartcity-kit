import * as React from "react";
import { KeyValue, KeyValues, Text } from "@empressaio/smartcity-kit";

/**
 * The demo fixture asset record. Identifier values set in the data step so a
 * code is never mistaken for a sentence, and the id itself says it is a
 * fixture rather than a number a city issued.
 */
export const AssetRecord = () => (
  <KeyValues>
    <KeyValue label="Asset id">
      <Text step="data">Fixture, not issued by a city</Text>
    </KeyValue>
    <KeyValue label="Condition">Unread, with the inspection date that set it</KeyValue>
  </KeyValues>
);

export const Place = () => (
  <KeyValues>
    <KeyValue label="Place">Resolved from the city map, never typed</KeyValue>
  </KeyValues>
);
