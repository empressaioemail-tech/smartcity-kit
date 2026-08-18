import * as React from "react";
import { Tab, Tabs } from "@empressaio/smartcity-kit";

/**
 * One tab is an anchor. The Assets set is the gallery's Tab entry; the Review
 * tab selected on Development services is the unselected-versus-selected axis.
 */
export const Assets = () => (
  <Tabs label="Assets">
    <Tab selected href="/?work=assets&atab=inventory">
      Inventory
    </Tab>
    <Tab href="/?work=assets&atab=map">Map</Tab>
    <Tab href="/?work=assets&atab=fixture">Demo fixture record</Tab>
  </Tabs>
);

export const DevelopmentServices = () => (
  <Tabs label="Development services">
    <Tab href="/?lens=development-services&tab=pipeline">Pipeline</Tab>
    <Tab href="/?lens=development-services&tab=place">Place</Tab>
    <Tab selected href="/?lens=development-services&tab=review">
      Review
    </Tab>
    <Tab href="/?lens=development-services&tab=inspections">Inspections</Tab>
    <Tab href="/?lens=development-services&tab=code-enforcement">Code enforcement</Tab>
    <Tab href="/?lens=development-services&tab=licenses">Licenses</Tab>
  </Tabs>
);
