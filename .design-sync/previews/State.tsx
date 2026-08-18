import * as React from "react";
import { State } from "@empressaio/smartcity-kit";

/**
 * Honest absence, which 30b law 5 makes a designed state rather than a gap:
 * absence is stated, never simulated. Every one of these says what is missing,
 * why, and on what basis — no zero, no placeholder count, no empty rectangle.
 */
export const NoRecords = () => (
  <State
    kicker="Pipeline unread"
    heading="No cases are in flight on this pack."
    basis="no adapter granted and no records generated"
  >
    The queue is first-class once a permit source is granted or the pack generates
    records. Until then this tab stays empty. Stage names are not invented, and no
    internal routing is shown.
  </State>
);

export const NotAZero = () => (
  <State
    kicker="No source connected"
    heading="No finance records for this city yet."
    basis="0 of 4 required sources connected. Contact: city finance director."
  >
    This lens reads from the adopted budget, the fund ledger, permit fee revenue and
    department spend. None of the four has been connected as a confirmed ledger, so
    there is nothing to report. That is not a zero balance.
  </State>
);

export const Compact = () => (
  <State
    compact
    kicker="Lens on the roster"
    heading="Parks is named, and not built."
    basis="no view designed for this lens"
  />
);
