import * as React from "react";
import { Prov } from "@empressaio/smartcity-kit";

/**
 * Provenance chips. Unread is the Public meetings panel head, public-record is
 * the region footer, and the pack grant line is the navigation-footer source,
 * which G-93 split into two claims.
 */
export const Unread = () => <Prov source="City clerk calendar" detail={<span>unread</span>} />;

export const PublicRecord = () => <Prov source="Public record" />;

/**
 * Two figures on one chip, because they are two claims: a granted source is
 * connected, a demonstrated kind is generated fixture data that connects
 * nothing. The two figures paint together at the head and the two counting
 * rules paint together at the tail, which is the order the product serves. The
 * second claim cannot be written without its own rule.
 */
export const PackGrant = () => (
  <Prov
    source="Sources not read"
    secondClaim={{
      source: "Demonstration not read",
      detail: <span>no demonstration count has been read for this pack</span>,
    }}
    detail={
      <>
        <span data-pack-key>this pack</span> <span>no grant count has been read for this pack</span>
      </>
    }
    href="/?work=connections"
  />
);
