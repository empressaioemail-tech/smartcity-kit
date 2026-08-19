import * as React from "react";
import {
  ActionBar,
  AtomChip,
  Basis,
  BasisLine,
  BrandCity,
  Button,
  ButtonLink,
  Cite,
  CitizenColumn,
  CitizenLookup,
  CitizenScroll,
  ColStack,
  CompassGrab,
  CompassHead,
  CompassInner,
  CompassNote,
  CompassScope,
  CompassScrim,
  CompassSheet,
  CompassSource,
  CompassThread,
  CompassTurn,
  Crumb,
  DataBody,
  DataCell,
  DataHead,
  DataHeadCell,
  DataRow,
  DataTable,
  EnvBadge,
  Fill,
  Finding,
  Grow,
  Input,
  KeyValue,
  KeyValues,
  Lede,
  Lens,
  Matrix,
  MatrixGroup,
  MatrixRow,
  MenuButton,
  Metric,
  MetricStrip,
  ModelCite,
  MountNote,
  NavFoot,
  NavGroup,
  NavItem,
  PageHead,
  Panel,
  PanelBody,
  PanelHead,
  Pill,
  Prov,
  RegisterGroup,
  Region,
  RegionBar,
  RegionCanvas,
  RegionFoot,
  RosterNote,
  SearchField,
  Seal,
  Shell,
  ShellBody,
  ShellMain,
  ShellNav,
  ShellRecede,
  ShellRegions,
  ShellTop,
  SourceRow,
  Stage,
  StageEsc,
  StageScrim,
  State,
  Tab,
  TabPanel,
  Tabs,
  Text,
  Theme,
  TitleRow,
  UnverifiedSource,
} from "../dist/index.mjs";
import {
  FIXTURE_BASIS,
  FIXTURE_RECORDS,
  FIXTURE_RECORD_COUNT,
  STAGE_LABELS,
  countsByStatus,
  statusOf,
} from "./fixtures";
import { CompassPanel, OverviewHeader, Sidebar, TopBar } from "./screens";

export { SCREENS, OverviewScreen, OverviewLens, CompassPanel, TopBar, Sidebar } from "./screens";

/**
 * The gallery is the single registry every consumer of this repo reads: the
 * gate-3 class check renders it, the coverage figure counts it, the markup
 * parity test compares it, and the screenshot harness draws it.
 *
 * It exists as one registry rather than four lists because a hand-kept list of
 * emitted classes goes stale silently, and a stale list is exactly what this
 * package is here to prevent one layer up.
 */
export type GalleryEntry = {
  /** The exported name. A completeness test asserts every export appears here. */
  component: string;
  /** Which classes this example is here to cover. Checked against what it renders. */
  covers: string[];
  /** Where in the shipped product this example was taken from. */
  from: string;
  node: React.ReactNode;
};

/** The record contract declares a meaning; only this line turns one into a carrier. */
const MEANING = {
  crit: "crit",
  warn: "warn",
  info: "info",
  ok: "ok",
} as const;

const searchIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

/**
 * The pipeline queue, rebuilt from kit components over the records the fixture
 * pack generates. Column order is the product's fixed order, the status carrier
 * is derived from the meaning the record contract declares, and the counting
 * rule travels in the basis line under the table.
 */
export function PipelineTable() {
  return (
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
          {FIXTURE_RECORDS.map((record) => {
            const status = statusOf(record.status);
            return (
              <DataRow key={record.recordId}>
                <DataCell cell="id">{record.recordId}</DataCell>
                <DataCell cell="subject">{record.subject}</DataCell>
                <DataCell>{STAGE_LABELS[record.stage] ?? record.stage}</DataCell>
                <DataCell>{record.place}</DataCell>
                <DataCell>
                  <Text step="data">{record.dueLabel}</Text>
                </DataCell>
                <DataCell>
                  <Pill meaning={status ? MEANING[status.severity] : "quiet"}>
                    {status ? status.label : record.status}
                  </Pill>
                </DataCell>
              </DataRow>
            );
          })}
        </DataBody>
      </DataTable>
      <PanelBody>
        <Basis>{FIXTURE_BASIS}</Basis>
      </PanelBody>
    </>
  );
}

export const GALLERY: GalleryEntry[] = [
  /* ------------------------------------------------------------- foundation */
  {
    component: "Theme",
    covers: ["sc-light", "sc-dark", "t-caption"],
    from: "index.html, the citizen lens forces light inside the dark staff session",
    node: (
      <>
        <Theme mode="light">
          <Text step="caption">Light subtree</Text>
        </Theme>
        <Theme mode="dark">
          <Text step="caption">Dark subtree</Text>
        </Theme>
      </>
    ),
  },
  {
    component: "Text",
    covers: ["t-label", "t-caption", "t-data"],
    from: "index.html, roster-note label, panel captions, the parcel identifier in a region footer",
    node: (
      <>
        <Text step="label">Jobs waiting on this lens</Text>
        <Text step="caption">Decision queue</Text>
        <Text step="data">48021:34137</Text>
      </>
    ),
  },
  {
    component: "Grow",
    covers: ["grow"],
    from: "index.html, every panel head that carries trailing controls",
    node: <Grow />,
  },
  {
    component: "Fill",
    covers: ["fill"],
    from: "shell.css, the flexible gap inside a page-header title row",
    node: <Fill />,
  },

  /* ---------------------------------------------------------------- controls */
  {
    component: "Button",
    covers: ["btn", "btn-primary", "btn-ghost", "btn-sm"],
    from: "index.html, Assets action bar and the region-bar Expand and Full controls",
    node: (
      <>
        <Button>Record an asset</Button>
        <Button kind="primary">Look up</Button>
        <Button kind="ghost" size="sm">
          Expand
        </Button>
        <Button size="sm" disabled>
          Export
        </Button>
      </>
    ),
  },
  {
    component: "ButtonLink",
    covers: ["btn", "btn-ghost", "btn-sm"],
    from: "index.html, Open in Work on the Development services Review tab",
    node: (
      <ButtonLink kind="ghost" size="sm" href="/?work=review">
        Open in Work
      </ButtonLink>
    ),
  },
  {
    component: "MenuButton",
    covers: ["btn", "btn-ghost", "menu-btn"],
    from: "index.html, the narrow-viewport navigation toggle in the top bar",
    node: <MenuButton aria-label="Open menu" />,
  },
  {
    component: "Input",
    covers: ["inp"],
    from: "index.html, the citizen address field",
    node: <Input type="search" placeholder="Enter an address" aria-label="Address" disabled />,
  },
  {
    component: "SearchField",
    covers: ["searchwrap", "badge-off", "inp"],
    from: "index.html, top-bar record search with its Not built badge",
    node: (
      <SearchField icon={searchIcon} notBuilt="Not built">
        <Input
          type="search"
          placeholder="Search records, parcels, cases"
          aria-label="Record search"
          disabled
        />
      </SearchField>
    ),
  },

  /* ------------------------------------------------------------ status carriers */
  {
    component: "Pill",
    covers: ["pill", "p-ok", "p-info", "p-warn", "p-crit", "p-restricted", "p-quiet"],
    from: "index.html, the four fixture-pipeline statuses plus the register and roster states",
    node: (
      <>
        <Pill>Empty</Pill>
        <Pill meaning="quiet">Not built</Pill>
        <Pill meaning="restricted">Preview</Pill>
        <Pill meaning="info">In review</Pill>
        <Pill meaning="warn">Awaiting applicant</Pill>
        <Pill meaning="crit">Overdue</Pill>
        <Pill meaning="ok">Ready to issue</Pill>
      </>
    ),
  },
  {
    component: "Prov",
    covers: ["prov", "sep"],
    from: "index.html, the Public meetings panel head and the navigation-footer source line",
    node: (
      <>
        <Prov source="City clerk calendar" detail={<span>unread</span>} />
        <Prov source="Public record" />
        <Prov source="67 of 67" detail="Homes-table row" />
        <Prov
          source="Sources not read"
          detail={
            <>
              <span data-pack-key>this pack</span> <span>no grant count has been read for this pack</span>
            </>
          }
          href="/?work=connections"
        />
      </>
    ),
  },
  {
    component: "Basis",
    covers: ["basis"],
    from: "index.html, the basis line under the Development services pipeline table",
    node: <Basis>{FIXTURE_BASIS}</Basis>,
  },
  {
    component: "Seal",
    covers: ["seal"],
    from: "index.html, the city seal in the top bar",
    node: <Seal>TC</Seal>,
  },
  {
    component: "BrandCity",
    covers: ["brandcity"],
    from: "index.html, the city name in the top bar",
    node: <BrandCity>This city</BrandCity>,
  },
  {
    component: "EnvBadge",
    covers: ["env", "demo"],
    from: "index.html, the environment badge beside the city name",
    node: (
      <>
        <EnvBadge environment="demo">Demo</EnvBadge>
        <EnvBadge environment="live">Live</EnvBadge>
        <EnvBadge environment="staging">Staging</EnvBadge>
      </>
    ),
  },
  /* ---------------------------------------------------------------- surfaces */
  {
    component: "Panel",
    covers: ["panel"],
    from: "index.html, every panel on every lens",
    node: <Panel>{null}</Panel>,
  },
  {
    component: "PanelHead",
    covers: ["panel-head", "t", "sub", "grow", "t-caption", "prov", "sep", "pill", "p-warn"],
    from: "index.html, the Public meetings and What needs you today panel heads",
    node: (
      <>
        <PanelHead title="What needs you today">
          <Text step="caption">Decision queue</Text>
        </PanelHead>
        <PanelHead title="Public meetings">
          <Prov source="City clerk calendar" detail={<span>unread</span>} />
          <Pill meaning="warn">Partial</Pill>
        </PanelHead>
        <PanelHead title="What is not an asset" />
        <PanelHead title="Pipeline" sub="Cases in flight" />
      </>
    ),
  },
  {
    component: "PanelBody",
    covers: ["panel-body", "flush", "t-caption"],
    from: "index.html, the Counter panel body and the flush register body",
    node: (
      <>
        <PanelBody>
          <Text step="caption" as="p">
            The inventory counter stays at zero until a city records an asset.
          </Text>
        </PanelBody>
        <PanelBody flush>{null}</PanelBody>
      </>
    ),
  },
  {
    component: "Tabs",
    covers: ["tabs"],
    from: "index.html, the Development services tab set",
    node: (
      <Tabs label="Development services">
        <Tab selected href="/?lens=development-services&tab=pipeline">
          Pipeline
        </Tab>
      </Tabs>
    ),
  },
  {
    component: "Tab",
    covers: ["tabs"],
    from: "index.html, the Assets tab set",
    node: (
      <Tabs label="Assets">
        <Tab selected href="/?work=assets&atab=inventory">
          Inventory
        </Tab>
        <Tab href="/?work=assets&atab=map">Map</Tab>
        <Tab href="/?work=assets&atab=fixture">Demo fixture record</Tab>
      </Tabs>
    ),
  },
  {
    component: "State",
    covers: ["state", "st-k", "basis", "compact"],
    from: "index.html, the Overview decision queue and a roster lens honest-empty",
    node: (
      <>
        <State
          kicker="Pipeline unread"
          heading="No cases are in flight on this pack."
          basis="no adapter granted and no records generated"
        >
          The queue is first-class once a permit source is granted or the pack generates records.
          Until then this tab stays empty.
        </State>
        <State
          compact
          kicker="Lens on the roster"
          heading="Parks is named, and not built."
          basis="no view designed for this lens"
        />
      </>
    ),
  },
  {
    component: "Metric",
    covers: ["metric", "k", "v", "n", "word", "has-value"],
    from: "index.html unread tiles, and the fixture pipeline populated tiles",
    node: (
      <>
        <Metric label="Meetings this week" unread="Not read" note="No clerk source" />
        {countsByStatus().map((c) => (
          <Metric
            key={c.id}
            label={c.label}
            value={c.count}
            note={`of ${FIXTURE_RECORD_COUNT} generated cases in flight`}
          />
        ))}
      </>
    ),
  },
  {
    component: "MetricStrip",
    covers: ["metrics", "metric", "k", "v", "n", "word"],
    from: "index.html, the Overview metric strip",
    node: (
      <MetricStrip>
        <Metric label="Needs a decision" unread="Not read" note="No operations source" />
        <Metric label="Overdue reviews" unread="Not read" note="Review mount is preview" />
        <Metric label="Permits in flight" unread="Not read" note="No permit source" />
        <Metric label="Meetings this week" unread="Not read" note="No clerk source" />
      </MetricStrip>
    ),
  },

  /* ----------------------------------------------------------------- records */
  {
    component: "DataTable",
    covers: ["dt", "id", "subj", "t-data", "pill", "p-crit", "p-warn", "p-info", "p-ok", "panel-body", "basis"],
    from: "app.js renderPipeline, over the fourteen records the fixture pack generates",
    node: <PipelineTable />,
  },
  { component: "DataHead", covers: ["dt", "id", "subj", "t-data", "pill", "p-crit", "p-warn", "p-info", "p-ok", "panel-body", "basis"], from: "app.js renderPipeline", node: <PipelineTable /> },
  { component: "DataHeadCell", covers: ["dt", "id", "subj", "t-data", "pill", "p-crit", "p-warn", "p-info", "p-ok", "panel-body", "basis"], from: "app.js renderPipeline", node: <PipelineTable /> },
  { component: "DataBody", covers: ["dt", "id", "subj", "t-data", "pill", "p-crit", "p-warn", "p-info", "p-ok", "panel-body", "basis"], from: "app.js renderPipeline", node: <PipelineTable /> },
  { component: "DataRow", covers: ["dt", "id", "subj", "t-data", "pill", "p-crit", "p-warn", "p-info", "p-ok", "panel-body", "basis"], from: "app.js renderPipeline", node: <PipelineTable /> },
  {
    component: "DataCell",
    covers: ["dt", "id", "subj", "t-data", "pill", "p-crit", "p-warn", "p-info", "p-ok", "panel-body", "basis"],
    from: "app.js td(record.recordId, \"id\") and td(record.subject, \"subj\")",
    node: <PipelineTable />,
  },
  {
    component: "SourceRow",
    covers: ["srcreg", "rail", "nm", "ok", "partial", "pill", "p-quiet", "p-restricted", "p-warn"],
    from: "index.html, the Finance source register and the Across departments register",
    node: (
      <>
        <SourceRow name="Adopted budget" description="Appropriations by fund and department for the current year">
          <Pill>Not connected</Pill>
        </SourceRow>
        <SourceRow
          rail="partial"
          name="Permit fee revenue"
          description="Fees assessed and collected, joined to the permit record"
        >
          <Pill meaning="warn">Partial</Pill>
        </SourceRow>
        <SourceRow rail="ok" name="ArcGIS" description="Place map, through the SmartSite mount">
          <Pill meaning="restricted">Mounted</Pill>
        </SourceRow>
      </>
    ),
  },
  {
    component: "RegisterGroup",
    covers: ["reg-group"],
    from: "index.html, the Built and Work and City group headings on Overview",
    node: (
      <>
        <RegisterGroup>Built</RegisterGroup>
        <RegisterGroup>Roster, not yet built</RegisterGroup>
      </>
    ),
  },
  {
    component: "KeyValues",
    covers: ["kv", "t-data"],
    from: "index.html, the demo fixture asset record",
    node: (
      <KeyValues>
        <KeyValue label="Asset id">
          <Text step="data">Fixture, not issued by a city</Text>
        </KeyValue>
        <KeyValue label="Condition">Unread, with the inspection date that set it</KeyValue>
      </KeyValues>
    ),
  },
  {
    component: "KeyValue",
    covers: ["kv"],
    from: "index.html, one row of the demo fixture asset record",
    node: (
      <KeyValues>
        <KeyValue label="Place">Resolved from the city map, never typed</KeyValue>
      </KeyValues>
    ),
  },
  {
    component: "ActionBar",
    covers: ["actionbar", "btn", "btn-sm"],
    from: "index.html, the Assets page-header actions",
    node: (
      <ActionBar>
        <Button size="sm" disabled>
          Record an asset
        </Button>
        <Button size="sm" disabled>
          Import inventory
        </Button>
      </ActionBar>
    ),
  },
  {
    component: "RosterNote",
    covers: ["roster-note", "roster-list", "t-label", "prov"],
    from: "index.html, Jobs waiting on this lens under Public works",
    node: (
      <RosterNote label="Jobs waiting on this lens">
        <Prov source="CIP / projects" />
        <Prov source="Reporting" />
        <Prov source="Phones" />
      </RosterNote>
    ),
  },

  /* ------------------------------------------------------------------ shell */
  {
    component: "Shell",
    covers: ["shell"],
    from: "index.html, the application frame",
    node: <Shell>{null}</Shell>,
  },
  {
    component: "ShellRecede",
    covers: ["cp-recede"],
    from: "index.html, everything the assistant sheet recedes behind",
    node: <ShellRecede>{null}</ShellRecede>,
  },
  {
    component: "ShellTop",
    covers: ["shell-top", "seal", "brandcity", "env", "demo", "grow", "searchwrap", "inp", "badge-off", "btn", "btn-ghost", "menu-btn", "cp-source", "cp-src-l"],
    from: "index.html, the top bar",
    node: <TopBar />,
  },
  {
    component: "ShellBody",
    covers: ["shell-body"],
    from: "index.html, the sidebar and main grid",
    node: <ShellBody>{null}</ShellBody>,
  },
  {
    component: "ShellNav",
    covers: ["shell-nav", "open", "navgroup", "gl", "navitem", "on", "roster", "badge", "grow", "nav-foot", "prov", "sep"],
    from: "index.html, the primary sidebar, and app.js which toggles open below the breakpoint",
    node: (
      <>
        <Sidebar />
        <ShellNav open>{null}</ShellNav>
      </>
    ),
  },
  {
    component: "ShellMain",
    covers: ["shell-main"],
    from: "index.html, the main column",
    node: <ShellMain>{null}</ShellMain>,
  },
  {
    component: "ShellRegions",
    covers: ["shell-regions", "solo"],
    from: "index.html, the two-column work surface and the single-column form",
    node: (
      <>
        <ShellRegions>{null}</ShellRegions>
        <ShellRegions solo>{null}</ShellRegions>
      </>
    ),
  },
  {
    component: "ColStack",
    covers: ["colstack", "rail"],
    from: "index.html, the panel column and the map rail column",
    node: (
      <>
        <ColStack>{null}</ColStack>
        <ColStack rail>{null}</ColStack>
      </>
    ),
  },
  {
    component: "NavGroup",
    covers: ["navgroup", "gl"],
    from: "index.html, the Lenses, Work and City groups",
    node: <NavGroup label="City">{null}</NavGroup>,
  },
  {
    component: "NavItem",
    covers: ["navitem", "on", "roster", "unbuilt", "badge", "grow"],
    from: "index.html, Overview active, Parks on the roster, and a not-built lens",
    node: (
      <>
        <NavItem active href="/?lens=city-manager" badge="Empty">
          Overview
        </NavItem>
        <NavItem href="/?work=connections">Connections</NavItem>
        <NavItem state="roster" href="/?lens=parks" badge="Not built">
          Parks
        </NavItem>
        <NavItem state="unbuilt" badge="Not built">
          Municipal court
        </NavItem>
      </>
    ),
  },
  {
    component: "NavFoot",
    covers: ["nav-foot", "prov", "sep"],
    from: "index.html, connection reality as text in the navigation footer",
    node: (
      <NavFoot>
        <Prov
          source="Sources not read"
          detail={
            <>
              <span data-pack-key>this pack</span> <span>no grant count has been read for this pack</span>
            </>
          }
          href="/?work=connections"
        />
      </NavFoot>
    ),
  },
  {
    component: "PageHead",
    covers: ["pagehead", "crumb", "titlerow", "lede", "pill", "p-quiet"],
    from: "index.html, the Overview page header",
    node: <OverviewHeader />,
  },
  {
    component: "Crumb",
    covers: ["crumb"],
    from: "index.html, the Development services breadcrumb",
    node: (
      <Crumb>
        <b>This city</b> <span>/</span> <b>Development services</b> <span>/</span>{" "}
        <span>Pipeline</span>
      </Crumb>
    ),
  },
  {
    component: "TitleRow",
    covers: ["titlerow", "pill", "p-restricted", "fill", "t-caption"],
    from: "index.html, the Plan review title row",
    node: (
      <TitleRow>
        <h1>Plan review</h1>
        <Pill meaning="restricted">Preview</Pill>
        <Fill />
        <Text step="caption">Same console as Development services, Review</Text>
      </TitleRow>
    ),
  },
  {
    component: "Lede",
    covers: ["lede"],
    from: "index.html, the Overview lede",
    node: <Lede>Where am I, what needs me, and what is missing.</Lede>,
  },
  {
    component: "Lens",
    covers: ["lens", "on"],
    from: "index.html, one lens section per department",
    node: (
      <>
        <Lens active>{null}</Lens>
        <Lens>{null}</Lens>
      </>
    ),
  },
  {
    component: "TabPanel",
    covers: ["ds-tab", "assets-tab", "on"],
    from: "index.html, the Development services and Assets tab panels",
    node: (
      <>
        <TabPanel group="development-services" active>
          {null}
        </TabPanel>
        <TabPanel group="assets">{null}</TabPanel>
      </>
    ),
  },

  /* ---------------------------------------------------------------- regions */
  {
    component: "Region",
    covers: ["region"],
    from: "index.html, the city map region on Overview",
    node: <Region>{null}</Region>,
  },
  {
    component: "RegionBar",
    covers: ["region-bar", "t", "grow", "t-caption", "btn", "btn-ghost", "btn-sm"],
    from: "index.html, the map region bar",
    node: (
      <RegionBar title="The city">
        <Text step="caption">SmartSite</Text>
        <Button kind="ghost" size="sm" data-stage-present="map">
          Expand
        </Button>
        <Button kind="ghost" size="sm" data-stage-max="map">
          Full
        </Button>
      </RegionBar>
    ),
  },
  {
    component: "RegionCanvas",
    covers: ["region-canvas", "doc", "mount-note"],
    from: "index.html, the map canvas and the document canvas",
    node: (
      <>
        <RegionCanvas data-stage="map">
          <MountNote>The city map mounts here.</MountNote>
        </RegionCanvas>
        <RegionCanvas ground="doc" data-stage="review">
          <MountNote>The review console mounts here.</MountNote>
        </RegionCanvas>
      </>
    ),
  },
  {
    component: "RegionFoot",
    covers: ["region-foot", "t-data", "t-caption", "grow", "prov"],
    from: "index.html, the map region footer",
    node: (
      <RegionFoot>
        <Text step="data">48021:34137</Text>
        <Text step="caption">Demo fixture</Text>
        <Grow />
        <Prov source="Public record" />
      </RegionFoot>
    ),
  },
  {
    component: "MountNote",
    covers: ["mount-note", "t-data"],
    from: "index.html, the Assets map placeholder with its heading",
    node: (
      <MountNote heading="No asset layer">
        The city outline appears here once the city is drawn.
      </MountNote>
    ),
  },
  {
    component: "Stage",
    covers: ["stage", "doc", "is-presented", "is-max"],
    from: "index.html and app.js, the three mount stages and their presentation states",
    node: (
      <>
        <Stage>{null}</Stage>
        <Stage ground="doc">{null}</Stage>
        <Stage state="presented">{null}</Stage>
        <Stage state="max">{null}</Stage>
      </>
    ),
  },
  {
    component: "StageScrim",
    covers: ["stage-scrim"],
    from: "index.html, the ground behind a presented stage",
    node: <StageScrim />,
  },
  {
    component: "StageEsc",
    covers: ["stage-esc", "prov", "sep", "btn", "btn-sm"],
    from: "index.html, the escape affordance shown while a stage is presented",
    node: (
      <StageEsc>
        <Prov source="Map" detail="Escape to close" />
        <Button size="sm">Close</Button>
      </StageEsc>
    ),
  },

  /* ---------------------------------------------------------------- citizen */
  {
    component: "CitizenScroll",
    covers: ["cz-scroll", "sc-light", "sc-dark"],
    from: "index.html, the citizen lens scoped light",
    node: (
      <>
        <CitizenScroll>{null}</CitizenScroll>
        <CitizenScroll theme="dark">{null}</CitizenScroll>
      </>
    ),
  },
  {
    component: "CitizenColumn",
    covers: ["cz"],
    from: "index.html, the single citizen reading column",
    node: <CitizenColumn>{null}</CitizenColumn>,
  },
  {
    component: "CitizenLookup",
    covers: ["citizen-lookup", "searchwrap", "inp", "btn", "btn-primary"],
    from: "index.html, Look up an address on the citizen lens",
    node: (
      <CitizenLookup>
        <SearchField icon={searchIcon}>
          <Input type="search" placeholder="Enter an address" aria-label="Address" disabled />
        </SearchField>
        <Button kind="primary" disabled>
          Look up
        </Button>
      </CitizenLookup>
    ),
  },

  /* ---------------------------------------------------------------- compass */
  {
    component: "CompassSource",
    covers: ["cp-source", "cp-src-l"],
    from: "index.html, the Compass control in the top bar",
    node: <CompassSource scope="This city · Overview" aria-expanded="false" />,
  },
  {
    component: "CompassScrim",
    covers: ["cp-scrim"],
    from: "index.html, the ground behind the presented sheet",
    node: <CompassScrim />,
  },
  {
    component: "CompassSheet",
    covers: [
      "cp-sheet",
      "cp-inner",
      "cp-head",
      "cp-grab",
      "t-label",
      "grow",
      "pill",
      "p-quiet",
      "btn",
      "btn-ghost",
      "btn-sm",
      "cp-scope",
      "prov",
      "sep",
      "env",
      "demo",
      "cp-thread",
      "cp-turn",
      "cp-note",
    ],
    from: "index.html, the whole Compass sheet",
    node: <CompassPanel />,
  },
  {
    component: "CompassInner",
    covers: ["cp-inner"],
    from: "index.html, the sheet interior",
    node: <CompassInner>{null}</CompassInner>,
  },
  {
    component: "CompassHead",
    covers: ["cp-head", "cp-grab", "t-label", "grow"],
    from: "index.html, the sheet head",
    node: (
      <CompassHead>
        <CompassGrab title="Drag to dismiss" />
        <Text step="label">Compass</Text>
        <Grow />
      </CompassHead>
    ),
  },
  {
    component: "CompassGrab",
    covers: ["cp-grab"],
    from: "index.html, the drag affordance",
    node: <CompassGrab />,
  },
  {
    component: "CompassScope",
    covers: ["cp-scope", "prov", "sep", "env", "demo"],
    from: "index.html, the mandatory scope line",
    node: (
      <CompassScope>
        <Prov source="This city" detail="Overview" />
        <EnvBadge environment="demo">Demo</EnvBadge>
      </CompassScope>
    ),
  },
  {
    component: "CompassThread",
    covers: ["cp-thread", "cp-turn", "cp-note"],
    from: "index.html, the thread",
    node: (
      <CompassThread>
        <CompassTurn>Compass follows the current city and lens.</CompassTurn>
        <CompassNote>The sheet is chrome until the answer engine is built.</CompassNote>
      </CompassThread>
    ),
  },
  {
    component: "CompassTurn",
    covers: ["cp-turn"],
    from: "index.html, one turn in the thread",
    node: <CompassTurn>Compass follows the current city and lens.</CompassTurn>,
  },
  {
    component: "CompassNote",
    covers: ["cp-note"],
    from: "index.html, a note about what the assistant cannot do",
    node: <CompassNote>The sheet is chrome until the answer engine is built.</CompassNote>,
  },
  /* --------------------------------------------------------------- evidence */
  {
    component: "Cite",
    covers: ["cite"],
    from: "shell.css .cite, the local-ordinance form. The product ships the CSS and no instance yet, so the composition is 30b plate 4.4b, the citation chips in a finding meta line",
    node: (
      <>
        <Cite href="#s4" marker="local">
          Template UDC Section 5.3.2
        </Cite>
        <Cite href="#s4" marker="local">
          Template UDC Section 7.2.6
        </Cite>
        <Cite href="#s4">Template UDC Section 5.4.1</Cite>
      </>
    ),
  },
  {
    component: "ModelCite",
    covers: ["cite", "model", "corpus", "sect"],
    from: "shell.css .cite.model, the licensed form. The product ships the CSS and no instance yet, so the composition is 30b plate 4.4b, the licensed citation in a finding meta line",
    node: (
      <>
        <ModelCite
          href="#s4"
          corpus="2018 International Building Code"
          section="Section 1004.5"
        />
        <ModelCite href="#s4" corpus="2018 International Building Code" section="Section 802.3" />
      </>
    ),
  },
  {
    component: "AtomChip",
    covers: ["atomchip", "dead", "did"],
    from: "shell.css .atomchip. The product ships the CSS and no instance yet, so the markup contract is 30c section 6.3, the fact-row chip and the answer accordion",
    node: (
      <>
        <AtomChip record="zoning 48021:34137">Record</AtomChip>
        <AtomChip record="parcel 48021:34137" open>
          Record
        </AtomChip>
        <AtomChip record="permit FIX-1014" unservable>
          3
        </AtomChip>
      </>
    ),
  },
  {
    component: "UnverifiedSource",
    covers: ["atomchip", "web"],
    from: "shell.css .atomchip.web. 30c section 6.3: a web or unverified source is visually distinct, labelled unverified, and never wears the atom chip",
    node: (
      <>
        <UnverifiedSource>Web, unverified</UnverifiedSource>
        <UnverifiedSource>Search result, unverified</UnverifiedSource>
      </>
    ),
  },
  {
    component: "Matrix",
    covers: ["c", "lic", "mx", "mx-fail", "mx-pass", "mx-unc", "mx-unchecked", "mxgroup", "mxrow", "p-crit", "p-ok", "p-quiet", "p-warn", "pill", "rail", "sec", "txt"],
    from: "shell.css .mx. The product ships the CSS and no instance yet, so the composition is 30b plate 4.4a, the applicability matrix",
    node: (
      <Matrix>
        <MatrixGroup corpus="Template Unified Development Code" licence="Local, adopted 2024" />
        <MatrixRow
          applicability="uncertain"
          section="Section 7.2.6"
          statement="Drainage plan required. Site grades conflict between sheets C-101 and C-201."
        >
          <Pill meaning="warn">Uncertain</Pill>
        </MatrixRow>
        <MatrixRow applicability="pass" section="Section 5.3.2" statement="Front setback">
          <Pill meaning="ok">Passed</Pill>
        </MatrixRow>
        <MatrixGroup corpus="2018 International Building Code" licence="Licensed, citation only" />
        <MatrixRow
          applicability="unchecked"
          section="Section 802.3"
          statement="Interior finish classification, not yet evaluated"
        >
          <Pill>Unchecked</Pill>
        </MatrixRow>
        <MatrixRow
          applicability="fail"
          section="Section 1004.5"
          statement="Occupant load exceeds the value the submitted plan is designed to"
        >
          <Pill meaning="crit">Fails code</Pill>
        </MatrixRow>
      </Matrix>
    ),
  },
  {
    component: "MatrixGroup",
    covers: ["c", "grow", "lic", "mxgroup", "t-caption"],
    from: "shell.css .mxgroup. 30b plate 4.4a for the two-part header, 30c line 1109 for the trailing section count",
    node: (
      <>
        <MatrixGroup corpus="Template Unified Development Code" licence="Local, adopted 2024" />
        <MatrixGroup corpus="2018 International Building Code" licence="Licensed, citation only">
          <Grow />
          <Text step="caption">28 sections</Text>
        </MatrixGroup>
      </>
    ),
  },
  {
    component: "MatrixRow",
    covers: ["mx-fail", "mx-pass", "mx-unc", "mx-unchecked", "mxrow", "p-crit", "p-ok", "p-quiet", "p-warn", "pill", "rail", "sec", "txt"],
    from: "shell.css .mxrow. 30b plate 4.4a, the four values in the order a reviewer meets them",
    node: (
      <>
        <MatrixRow
          applicability="unchecked"
          section="Section 802.3"
          statement="Interior finish classification, not yet evaluated"
        >
          <Pill>Unchecked</Pill>
        </MatrixRow>
        <MatrixRow
          applicability="fail"
          section="Section 1004.5"
          statement="Occupant load exceeds the value the submitted plan is designed to"
        >
          <Pill meaning="crit">Fails code</Pill>
        </MatrixRow>
        <MatrixRow
          applicability="uncertain"
          section="Section 7.2.6"
          statement="Drainage plan required. Site grades conflict between sheets C-101 and C-201."
        >
          <Pill meaning="warn">Uncertain</Pill>
        </MatrixRow>
        <MatrixRow applicability="pass" section="Section 5.3.2" statement="Front setback">
          <Pill meaning="ok">Passed</Pill>
        </MatrixRow>
      </>
    ),
  },
  {
    component: "BasisLine",
    covers: ["basisline", "conf", "f", "meter"],
    from: "shell.css .basisline. 30b plate 4.2b, the basis line under a provenance chip, and plate 4.4b inside a finding",
    node: (
      <>
        <BasisLine
          confidence={{ state: "provenance-backed", level: 3, of: 4 }}
          sources="3 sources"
          read="2026-08-17 09:42"
          reasoning="#s4"
        />
        <BasisLine
          confidence={{ state: "baseline", level: 2, of: 4 }}
          sources="1 source"
          read="needs a human determination"
          reasoning="#s4"
        />
        <BasisLine sources={FIXTURE_BASIS} read="read when the fixture pack was generated" />
      </>
    ),
  },
  {
    component: "Finding",
    covers: ["basisline", "btn", "btn-primary", "btn-sm", "cite", "conf", "corpus", "crit", "f", "fact", "fbody", "fid", "finding", "fmeta", "ftitle", "meter", "model", "p-crit", "p-warn", "pill", "prov", "rail", "sect", "sep"],
    from: "shell.css .finding. The product ships the CSS and no instance yet, so the composition is 30b plate 4.4b, the unit of a comment letter",
    node: (
      <>
        <Finding
          critical
          identifier="F-04"
          title="Occupant load exceeds the value the submitted plan is designed to."
          basis={{
            confidence: { state: "provenance-backed", level: 4, of: 4 },
            sources: "3 sources",
            read: "determined 2026-08-17 09:42",
            reasoning: "#s4",
          }}
          actions={
            <>
              <Button size="sm">Override</Button>
              <Button kind="primary" size="sm">
                Accept
              </Button>
            </>
          }
        >
          <ModelCite
            href="#s4"
            corpus="2018 International Building Code"
            section="Section 1004.5"
          />
          <Prov source="Sheet A-501" detail="detail 3" />
          <Pill meaning="crit">Fails code</Pill>
        </Finding>
        <Finding
          identifier="F-05"
          title="Drainage plan required. Site grades conflict between sheets C-101 and C-201."
          basis={{
            confidence: { state: "baseline", level: 2, of: 4 },
            sources: "2 sheets",
            read: "needs a human determination",
            reasoning: "#s4",
          }}
          actions={
            <>
              <Button size="sm">Override</Button>
              <Button kind="primary" size="sm">
                Accept
              </Button>
            </>
          }
        >
          <Cite href="#s4" marker="local">
            Template UDC Section 7.2.6
          </Cite>
          <Prov source="Sheet C-101" detail="and C-201" />
          <Pill meaning="warn">Uncertain</Pill>
        </Finding>
      </>
    ),
  },
];
