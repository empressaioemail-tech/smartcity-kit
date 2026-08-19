import * as React from "react";
import { Button, PanelHead, Pop, TopMenu } from "@empressaio/smartcity-kit";

const bell = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M4 6.6a4 4 0 018 0c0 3 1 3.9 1 3.9H3s1-.9 1-3.9z" />
    <path d="M6.6 12.8a1.6 1.6 0 002.8 0" />
  </svg>
);

/**
 * A top-bar menu. The anchor a dropdown is positioned against, and nothing
 * more: it holds a trigger and a panel and has no opinion about focus, keyboard
 * handling or dismissal, because none of those is a class the stylesheet ships.
 *
 * The panel is closed here, which is how the product serves it.
 */
export const Closed = () => (
  <TopMenu>
    <Button kind="ghost" size="sm" aria-label="Notifications">
      {bell}
    </Button>
    <Pop label="Notifications">
      <PanelHead title="Notifications" />
    </Pop>
  </TopMenu>
);
