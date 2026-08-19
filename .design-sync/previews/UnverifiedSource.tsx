import * as React from "react";
import { AtomChip, UnverifiedSource } from "@empressaio/smartcity-kit";

/**
 * A web or otherwise unverified source. It is never an atom chip.
 *
 * Neutral ink, a pill radius rather than a control radius, no accent, and no
 * record to open. Do not reach for AtomChip here to make a page look more
 * evidenced: the accent is a promise that there is a record behind the chip,
 * and an unverified source has none.
 */
export const Unverified = () => (
  <>
    <UnverifiedSource>Web, unverified</UnverifiedSource>
    <UnverifiedSource>Search result, unverified</UnverifiedSource>
  </>
);

/** Beside a real record chip, so the difference in shape is the point. */
export const BesideARecord = () => (
  <>
    <AtomChip record="zoning 48021:34137">Record</AtomChip>
    <UnverifiedSource>Web, unverified</UnverifiedSource>
  </>
);
