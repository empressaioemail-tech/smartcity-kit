import * as React from "react";
import {
  DataBody,
  DataCell,
  DataHead,
  DataHeadCell,
  DataRow,
  DataTable,
  Pill,
  Text,
} from "@empressaio/smartcity-kit";

/**
 * `cell` is the column's job, not an ARIA role. Identifier cells set in mono,
 * the subject cell reads in ink, everything else is secondary, and colour
 * lives only in the status carrier.
 */
export const Identifier = () => (
  <DataTable caption="Generated permit case identifiers">
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
        <DataCell cell="id">FIX-1035</DataCell>
        <DataCell cell="subject">Residential solar array</DataCell>
        <DataCell>
          <Pill meaning="warn">Awaiting applicant</Pill>
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

export const SubjectAndDue = () => (
  <DataTable caption="Generated permit cases, subject and due">
    <DataHead>
      <DataHeadCell>Case</DataHeadCell>
      <DataHeadCell>Subject</DataHeadCell>
      <DataHeadCell>Due</DataHeadCell>
      <DataHeadCell>Status</DataHeadCell>
    </DataHead>
    <DataBody>
      <DataRow>
        <DataCell cell="id">FIX-1014</DataCell>
        <DataCell cell="subject">Roof replacement</DataCell>
        <DataCell>
          <Text step="data">17 days past due</Text>
        </DataCell>
        <DataCell>
          <Pill meaning="crit">Overdue</Pill>
        </DataCell>
      </DataRow>
      <DataRow>
        <DataCell cell="id">FIX-1070</DataCell>
        <DataCell cell="subject">Fence and retaining wall</DataCell>
        <DataCell>
          <Text step="data">due in 4 days</Text>
        </DataCell>
        <DataCell>
          <Pill meaning="info">In review</Pill>
        </DataCell>
      </DataRow>
    </DataBody>
  </DataTable>
);
