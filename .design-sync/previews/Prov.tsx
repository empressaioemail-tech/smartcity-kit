import * as React from "react";
import { Prov } from "@empressaio/smartcity-kit";

/**
 * Provenance chips. Unread is the Public meetings panel head, public-record is
 * the region footer, and the pack grant line is the navigation-footer source.
 */
export const Unread = () => <Prov source="City clerk calendar" detail={<span>unread</span>} />;

export const PublicRecord = () => <Prov source="Public record" />;

export const PackGrant = () => (
  <Prov
    source="Sources not read"
    detail={
      <>
        <span data-pack-key>this pack</span> <span>no grant count has been read for this pack</span>
      </>
    }
    href="/?work=connections"
  />
);
