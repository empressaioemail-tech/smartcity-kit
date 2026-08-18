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
  Shell,
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

function StaffTopBar() {
  return (
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
}

/**
 * The application frame. One shell, one navigation, one accent. Resting is the
 * staff chrome with the main column named; NavOpen is the sidebar the product
 * toggles below the breakpoint.
 */
export const Resting = () => (
  <Shell>
    <ShellRecede>
      <StaffTopBar />
      <ShellBody>
        <ShellNav>
          <NavGroup label="City">
            <NavItem href="/?work=connections">Connections</NavItem>
          </NavGroup>
        </ShellNav>
        <ShellMain>
          <Text step="caption">The main column. Page head and work surface nest here.</Text>
        </ShellMain>
      </ShellBody>
    </ShellRecede>
  </Shell>
);

export const NavOpen = () => (
  <Shell>
    <ShellRecede>
      <StaffTopBar />
      <ShellBody>
        <ShellNav open>
          <NavGroup label="Lenses">
            <NavItem active href="/?lens=city-manager" badge="Empty">
              Overview
            </NavItem>
            <NavItem state="roster" href="/?lens=parks" badge="Not built">
              Parks
            </NavItem>
          </NavGroup>
          <NavGroup label="City">
            <NavItem href="/?work=connections">Connections</NavItem>
            <NavItem state="unbuilt" badge="Not built">
              Municipal court
            </NavItem>
          </NavGroup>
        </ShellNav>
        <ShellMain>
          <Text step="caption">The main column sits behind the open sidebar.</Text>
        </ShellMain>
      </ShellBody>
    </ShellRecede>
  </Shell>
);
