import * as React from "react";
import {
  Button,
  CitizenColumn,
  CitizenLookup,
  Input,
  Panel,
  PanelBody,
  PanelHead,
  Pill,
  SearchField,
  TitleRow,
} from "@empressaio/smartcity-kit";

const searchIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

/**
 * The single reading column. Citizen is a lens, not a separate product. The
 * heading and the lookup panel are the shipped nesting; the column is empty
 * without them.
 */
export const NearYou = () => (
  <CitizenColumn>
    <div>
      <TitleRow>
        <h1>Near you</h1>
        <Pill meaning="restricted">Preview</Pill>
      </TitleRow>
      <p>
        See what is happening around an address in this city. Nothing here requires
        an account. This is a public lens, not a separate product.
      </p>
    </div>
  </CitizenColumn>
);

export const Lookup = () => (
  <CitizenColumn>
    <Panel>
      <PanelHead title="Look up an address">
        <Pill meaning="quiet">Not built</Pill>
      </PanelHead>
      <PanelBody>
        <CitizenLookup>
          <SearchField icon={searchIcon}>
            <Input type="search" placeholder="Enter an address" aria-label="Address" disabled />
          </SearchField>
          <Button kind="primary" disabled>
            Look up
          </Button>
        </CitizenLookup>
      </PanelBody>
    </Panel>
  </CitizenColumn>
);
