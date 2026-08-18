import * as React from "react";
import {
  Basis,
  DataBody,
  DataCell,
  DataHead,
  DataHeadCell,
  DataRow,
  DataTable,
  PanelBody,
  Pill,
  Text,
} from "@empressaio/smartcity-kit";

/**
 * The queue table. Caption is the accessible name. Status last, identifier
 * first, generated permit cases only.
 */
export const Queue = () => (
  <>
    <DataTable caption="Generated permit cases in flight">
      <DataHead>
        <DataHeadCell>Case</DataHeadCell>
        <DataHeadCell>Subject</DataHeadCell>
        <DataHeadCell>Stage</DataHeadCell>
        <DataHeadCell>Place</DataHeadCell>
        <DataHeadCell>Due</DataHeadCell>
        <DataHeadCell>Status</DataHeadCell>
      </DataHead>
      <DataBody>
        <DataRow>
          <DataCell cell="id">FIX-1014</DataCell>
          <DataCell cell="subject">Roof replacement</DataCell>
          <DataCell>Revisions</DataCell>
          <DataCell>Specimen Yard Block 7, Lot 28</DataCell>
          <DataCell>
            <Text step="data">17 days past due</Text>
          </DataCell>
          <DataCell>
            <Pill meaning="crit">Overdue</Pill>
          </DataCell>
        </DataRow>
        <DataRow>
          <DataCell cell="id">FIX-1035</DataCell>
          <DataCell cell="subject">Residential solar array</DataCell>
          <DataCell>Revisions</DataCell>
          <DataCell>Fixture Ridge Block 5, Lot 26</DataCell>
          <DataCell>
            <Text step="data">due in 1 day</Text>
          </DataCell>
          <DataCell>
            <Pill meaning="warn">Awaiting applicant</Pill>
          </DataCell>
        </DataRow>
        <DataRow>
          <DataCell cell="id">FIX-1070</DataCell>
          <DataCell cell="subject">Fence and retaining wall</DataCell>
          <DataCell>Review</DataCell>
          <DataCell>Example Crossing Block 3, Lot 22</DataCell>
          <DataCell>
            <Text step="data">due in 4 days</Text>
          </DataCell>
          <DataCell>
            <Pill meaning="info">In review</Pill>
          </DataCell>
        </DataRow>
        <DataRow>
          <DataCell cell="id">FIX-1091</DataCell>
          <DataCell cell="subject">Sign permit</DataCell>
          <DataCell>Issuance</DataCell>
          <DataCell>Template Commons Block 2, Lot 22</DataCell>
          <DataCell>
            <Text step="data">due in 13 days</Text>
          </DataCell>
          <DataCell>
            <Pill meaning="ok">Ready to issue</Pill>
          </DataCell>
        </DataRow>
      </DataBody>
    </DataTable>
    <PanelBody>
      <Basis>generated from the adapter output contract; no city rows were read</Basis>
    </PanelBody>
  </>
);

export const StatusLast = () => (
  <DataTable caption="Generated permit cases, identifier and status">
    <DataHead>
      <DataHeadCell>Case</DataHeadCell>
      <DataHeadCell>Subject</DataHeadCell>
      <DataHeadCell>Status</DataHeadCell>
    </DataHead>
    <DataBody>
      <DataRow>
        <DataCell cell="id">FIX-1014</DataCell>
        <DataCell cell="subject">Roof replacement</DataCell>
        <DataCell>
          <Pill meaning="crit">Overdue</Pill>
        </DataCell>
      </DataRow>
      <DataRow>
        <DataCell cell="id">FIX-1091</DataCell>
        <DataCell cell="subject">Sign permit</DataCell>
        <DataCell>
          <Pill meaning="ok">Ready to issue</Pill>
        </DataCell>
      </DataRow>
    </DataBody>
  </DataTable>
);
