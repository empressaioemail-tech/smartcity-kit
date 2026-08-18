import * as React from "react";
import { Button } from "@empressaio/smartcity-kit";

/**
 * One primary per region, naming the outcome. Default is the Assets action,
 * primary is the citizen Look up, ghost sm is the region-bar Expand, and the
 * disabled sm is Export.
 */
export const Actions = () => (
  <>
    <Button>Record an asset</Button>
    <Button kind="primary">Look up</Button>
  </>
);

export const Region = () => (
  <>
    <Button kind="ghost" size="sm">
      Expand
    </Button>
    <Button size="sm" disabled>
      Export
    </Button>
  </>
);
