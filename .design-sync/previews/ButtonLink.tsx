import * as React from "react";
import { ButtonLink, PanelHead } from "@empressaio/smartcity-kit";

/**
 * A button rendered as a link. The product uses it for the Open in Work move
 * on the Development services Review tab.
 */
export const OpenInWork = () => (
  <ButtonLink kind="ghost" size="sm" href="/?work=review">
    Open in Work
  </ButtonLink>
);

export const Trailing = () => (
  <PanelHead title="Review">
    <ButtonLink kind="ghost" size="sm" href="/?work=review">
      Open in Work
    </ButtonLink>
  </PanelHead>
);
