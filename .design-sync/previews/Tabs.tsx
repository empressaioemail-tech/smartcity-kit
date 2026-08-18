import * as React from "react";
import { Tab, Tabs } from "@empressaio/smartcity-kit";

/**
 * A tab set is a real address, not a local switch. Development services is the
 * gallery's Tabs entry; Assets is the sibling set so the selected underline
 * has neighbours to read against.
 */
export const DevelopmentServices = () => (
  <Tabs label="Development services">
    <Tab selected href="/?lens=development-services&tab=pipeline">
      Pipeline
    </Tab>
    <Tab href="/?lens=development-services&tab=place">Place</Tab>
    <Tab href="/?lens=development-services&tab=review">Review</Tab>
    <Tab href="/?lens=development-services&tab=inspections">Inspections</Tab>
    <Tab href="/?lens=development-services&tab=code-enforcement">Code enforcement</Tab>
    <Tab href="/?lens=development-services&tab=licenses">Licenses</Tab>
  </Tabs>
);

export const Assets = () => (
  <Tabs label="Assets">
    <Tab selected href="/?work=assets&atab=inventory">
      Inventory
    </Tab>
    <Tab href="/?work=assets&atab=map">Map</Tab>
    <Tab href="/?work=assets&atab=fixture">Demo fixture record</Tab>
  </Tabs>
);
