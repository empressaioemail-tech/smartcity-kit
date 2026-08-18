import * as React from "react";
import { KeyValue, KeyValues, Text } from "@empressaio/smartcity-kit";

/**
 * One row of the demo fixture asset record. KeyValue is a dt/dd pair, so it
 * sits in KeyValues the way the product mounts it.
 */
export const Place = () => (
  <KeyValues>
    <KeyValue label="Place">Resolved from the city map, never typed</KeyValue>
  </KeyValues>
);

export const Identifier = () => (
  <KeyValues>
    <KeyValue label="Asset id">
      <Text step="data">Fixture, not issued by a city</Text>
    </KeyValue>
  </KeyValues>
);
