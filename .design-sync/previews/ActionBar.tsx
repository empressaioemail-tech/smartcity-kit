import * as React from "react";
import { ActionBar, Button, Grow, Pill, TitleRow } from "@empressaio/smartcity-kit";

/**
 * Assets page-header actions. Both controls are disabled because no inventory
 * exists to act on — empty is the designed state, not a withheld affordance.
 */
export const Inventory = () => (
  <ActionBar>
    <Button size="sm" disabled>
      Record an asset
    </Button>
    <Button size="sm" disabled>
      Import inventory
    </Button>
  </ActionBar>
);

export const OnAssets = () => (
  <TitleRow>
    <h1>Assets</h1>
    <Pill>Empty</Pill>
    <Grow />
    <ActionBar>
      <Button size="sm" disabled>
        Record an asset
      </Button>
      <Button size="sm" disabled>
        Import inventory
      </Button>
    </ActionBar>
  </TitleRow>
);
