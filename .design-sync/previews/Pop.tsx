import * as React from "react";
import { Basis, PanelBody, PanelHead, Pop, Text } from "@empressaio/smartcity-kit";

/**
 * The dropdown panel. Always a panel: the product writes both classes on every
 * instance and the popover class declares no border, background or radius of
 * its own, so an unpaired one would float unframed. The pair is emitted rather
 * than offered as a composition.
 *
 * It is closed by omission. A panel that opened by default would put the
 * loudest thing a top bar can do one forgotten prop away.
 */
export const Open = () => (
  <Pop label="Notifications" open>
    <PanelHead title="Notifications" />
    <PanelBody>
      <Text as="p" step="caption">
        No notifications.
      </Text>
      <Basis>not read</Basis>
      <Text as="p" step="caption">
        Counting rule: not read
      </Text>
    </PanelBody>
  </Pop>
);

/**
 * The label is required. A popover the assistive layer cannot name is a panel
 * that exists for sighted users only, and both shipped instances carry one.
 */
export const Closed = () => (
  <Pop label="Account">
    <PanelHead title="Session not read" />
  </Pop>
);
