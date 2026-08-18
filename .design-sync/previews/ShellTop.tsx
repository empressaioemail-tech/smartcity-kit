import * as React from "react";
import {
  BrandCity,
  CompassSource,
  EnvBadge,
  Grow,
  Input,
  MenuButton,
  SearchField,
  Seal,
  ShellTop,
} from "@empressaio/smartcity-kit";

const compassIcon = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" />
    <path d="M10.4 5.6L9 9 5.6 10.4 7 7z" />
  </svg>
);

const searchIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

/**
 * The top bar. It carries which city, which environment, search, and who you
 * are. It is not navigation. City chrome is This city; environment is Demo;
 * search is named Not built.
 */
export const StaffChrome = () => (
  <ShellTop>
    <MenuButton aria-label="Open menu" />
    <Seal />
    <BrandCity>
      <data data-pack-name="">This city</data>
    </BrandCity>
    <EnvBadge environment="demo">Demo</EnvBadge>
    <Grow as="div" />
    <SearchField icon={searchIcon} notBuilt="Not built">
      <Input
        type="search"
        placeholder="Search records, parcels, cases"
        aria-label="Record search"
        disabled
      />
    </SearchField>
    <CompassSource scope="This city · Overview" aria-expanded="false" aria-controls="cp-sheet">
      {compassIcon}
    </CompassSource>
  </ShellTop>
);

export const CityAndEnv = () => (
  <ShellTop>
    <Seal>TC</Seal>
    <BrandCity>
      <data data-pack-name="">This city</data>
    </BrandCity>
    <EnvBadge environment="demo">Demo</EnvBadge>
  </ShellTop>
);
