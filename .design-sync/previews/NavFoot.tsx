import * as React from "react";
import { NavFoot, Prov } from "@empressaio/smartcity-kit";

/**
 * Connection reality as text in the navigation footer. The product does not
 * count grants it has not read; the line names the pack and says so.
 */
export const SourcesUnread = () => (
  <NavFoot>
    <Prov
      source="Sources not read"
      detail={
        <>
          <span data-pack-key>this pack</span> <span>no grant count has been read for this pack</span>
        </>
      }
      href="/?work=connections"
    />
  </NavFoot>
);
