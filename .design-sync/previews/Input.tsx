import * as React from "react";
import { Input, SearchField } from "@empressaio/smartcity-kit";

const searchIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

/**
 * The citizen address field sits alone; the top-bar record search sits the
 * same Input inside SearchField. A disabled placeholder on the floor card is
 * not the composition.
 */
export const Address = () => (
  <Input type="search" placeholder="Enter an address" aria-label="Address" disabled />
);

export const RecordSearch = () => (
  <SearchField icon={searchIcon} notBuilt="Not built">
    <Input
      type="search"
      placeholder="Search records, parcels, cases"
      aria-label="Record search"
      disabled
    />
  </SearchField>
);
