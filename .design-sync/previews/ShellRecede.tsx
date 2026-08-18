import * as React from "react";
import {
  BrandCity,
  CompassSource,
  EnvBadge,
  Grow,
  Input,
  MenuButton,
  NavGroup,
  NavItem,
  SearchField,
  Seal,
  ShellBody,
  ShellMain,
  ShellNav,
  ShellRecede,
  ShellTop,
  Text,
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
 * Everything the assistant sheet recedes behind. The product wraps the top bar
 * and the shell body here so the sheet is a shared-element transition, not a
 * layer dropped on top of the page.
 */
export const BehindTheSheet = () => (
  <ShellRecede>
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
    <ShellBody>
      <ShellNav>
        <NavGroup label="City">
          <NavItem href="/?work=connections">Connections</NavItem>
        </NavGroup>
      </ShellNav>
      <ShellMain>
        <Text step="caption">Top bar and shell body recede together when Compass opens.</Text>
      </ShellMain>
    </ShellBody>
  </ShellRecede>
);

export const NavOpen = () => (
  <ShellRecede>
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
    <ShellBody>
      <ShellNav open>
        <NavGroup label="City">
          <NavItem href="/?work=connections">Connections</NavItem>
          <NavItem state="unbuilt" badge="Not built">
            Municipal court
          </NavItem>
        </NavGroup>
      </ShellNav>
      <ShellMain>
        <Text step="caption">The recede frame still holds the open sidebar.</Text>
      </ShellMain>
    </ShellBody>
  </ShellRecede>
);
