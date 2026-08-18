import * as React from "react";
import { MountNote, Stage } from "@empressaio/smartcity-kit";

/**
 * Four presentation states the product uses. The live stage is position:fixed
 * at 0x0 until app.js sizes it over an anchor. The card uses the same inline
 * size the product writes, so the grounds and the presented chrome photograph.
 */
const sized = { position: "relative" as const, width: 480, height: 280, top: "auto", left: "auto" };

export const Grounds = () => (
  <>
    <Stage style={sized}>
      <MountNote>The city map mounts here.</MountNote>
    </Stage>
    <Stage ground="doc" style={sized}>
      <MountNote>The review console mounts here.</MountNote>
    </Stage>
  </>
);

export const Presented = () => (
  <Stage state="presented" style={sized}>
    <MountNote>The city map mounts here.</MountNote>
  </Stage>
);

export const Max = () => (
  <Stage state="max" style={sized}>
    <MountNote>The city map mounts here.</MountNote>
  </Stage>
);
