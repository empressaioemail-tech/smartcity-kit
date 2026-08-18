import * as React from "react";
import { Basis, Text } from "@empressaio/smartcity-kit";

/**
 * The basis line under the Development services pipeline table. The component
 * writes the Basis: prefix; the children are the statement from the fixture
 * pack.
 */
export const Pipeline = () => (
  <Basis>generated from the MyGov adapter output contract; no city rows were read</Basis>
);

export const UnderCaption = () => (
  <>
    <Text step="caption">Cases in flight</Text>
    <Basis>generated from the MyGov adapter output contract; no city rows were read</Basis>
  </>
);
