import * as React from "react";
import { Button, CitizenLookup, Input, SearchField } from "@empressaio/smartcity-kit";

const searchIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

/**
 * Top-bar record search carries the Not built badge; the citizen lookup uses
 * the same wrap without the badge, with Look up beside it.
 */
export const NotBuilt = () => (
  <SearchField icon={searchIcon} notBuilt="Not built">
    <Input
      type="search"
      placeholder="Search records, parcels, cases"
      aria-label="Record search"
      disabled
    />
  </SearchField>
);

export const AddressLookup = () => (
  <CitizenLookup>
    <SearchField icon={searchIcon}>
      <Input type="search" placeholder="Enter an address" aria-label="Address" disabled />
    </SearchField>
    <Button kind="primary" disabled>
      Look up
    </Button>
  </CitizenLookup>
);
