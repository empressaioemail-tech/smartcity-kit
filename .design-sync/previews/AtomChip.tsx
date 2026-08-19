import * as React from "react";
import { AtomChip } from "@empressaio/smartcity-kit";

/**
 * The evidence chip. It marks a thing you can open and read the record of, and
 * the reserved atom accent is a promise about exactly that. Not chrome, not
 * emphasis, not a link treatment, not a second accent.
 *
 * Every chip carries a compact label and a mono record identifier. A chip with
 * a label and no identifier is a button wearing a reserved colour, so `record`
 * is required and there is no form of this without it.
 */
export const Openable = () => (
  <>
    <AtomChip record="zoning 48021:34137">Record</AtomChip>
    <AtomChip record="parcel 48021:34137">Record</AtomChip>
  </>
);

export const Open = () => (
  <AtomChip record="zoning 48021:34137" open>
    Record
  </AtomChip>
);

/**
 * An unservable record. It stays openable, because forbidden, unknown and
 * unservable all degrade identically to a local brief plus a statement that the
 * full record is unavailable, and the word forbidden never leaks.
 */
export const Unservable = () => (
  <AtomChip record="permit FIX-1014" unservable>
    3
  </AtomChip>
);
