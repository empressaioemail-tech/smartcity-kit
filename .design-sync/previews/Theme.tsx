import * as React from "react";
import { Text, Theme } from "@empressaio/smartcity-kit";

/**
 * Theme forces a subtree onto one token set. It is not a page provider: the
 * product sets dark on the root, and wrapping the card in Theme mode dark
 * paints dark ink onto a light canvas. These cells show the two subtrees the
 * gallery already ships, wrapping Text.
 */
export const LightSubtree = () => (
  <Theme mode="light">
    <Text step="caption">Light subtree</Text>
  </Theme>
);

export const DarkSubtree = () => (
  <Theme mode="dark">
    <Text step="caption">Dark subtree</Text>
  </Theme>
);
