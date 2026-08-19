import * as React from "react";
import { BasisLine } from "@empressaio/smartcity-kit";

/**
 * What a value rests on. Confidence always carries its state, and never travels
 * without a source count and a timestamp.
 *
 * There is no standalone meter in this kit and no confidence prop on any other
 * component, so the only way to draw a confidence value at all is through this
 * line. That is deliberate: a bare number with no basis is prohibited, and so
 * is an asserted baseline dressed as a calibrated result.
 */
export const ProvenanceBacked = () => (
  <BasisLine
    confidence={{ state: "provenance-backed", level: 3, of: 4 }}
    sources="3 sources"
    read="2026-08-17 09:42"
    reasoning="#reasoning"
  />
);

export const Baseline = () => (
  <BasisLine
    confidence={{ state: "baseline", level: 2, of: 4 }}
    sources="1 source"
    read="needs a human determination"
    reasoning="#reasoning"
  />
);

/** No confidence at all is honest. A confidence with no basis is not. */
export const NoConfidence = () => (
  <BasisLine
    sources="generated from the MyGov adapter output contract; no city rows were read"
    read="read when the fixture pack was generated"
  />
);
