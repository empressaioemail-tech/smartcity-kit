import * as React from "react";
import {
  Basis,
  BrandCity,
  Button,
  ColStack,
  CompassGrab,
  CompassHead,
  CompassInner,
  CompassNote,
  CompassScope,
  CompassSheet,
  CompassSource,
  CompassThread,
  CompassTurn,
  Crumb,
  EnvBadge,
  Grow,
  Input,
  Lede,
  Lens,
  MenuButton,
  Metric,
  MetricStrip,
  MountNote,
  NavFoot,
  NavGroup,
  NavItem,
  PageHead,
  Panel,
  PanelBody,
  PanelHead,
  Pill,
  Pop,
  PopGroup,
  PopItem,
  Prov,
  RegisterGroup,
  Region,
  RegionBar,
  RegionCanvas,
  RegionFoot,
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
  State,
  Text,
  TitleRow,
  TopMenu,
} from "../dist/index.mjs";

/**
 * The Overview lens, rebuilt out of kit components.
 *
 * This is the composed-screen proof. It mirrors the city-manager lens that
 * smartcity-dashboards ships in web/index.html, element for element and class
 * for class, and test/markup-parity.test.mjs compares the two.
 *
 * Nothing here is a city. Every string is either product chrome or the honest
 * absence the shipped page already renders, and the one parcel identifier is the
 * demo fixture the product itself labels as one.
 */

/**
 * The identity injection point. The product marks the spot where a city pack
 * writes its own name so that a compose failure cannot leave another pack name
 * on the page. The kit takes data attributes from its caller, so a composed
 * screen keeps the marker exactly where the product puts it.
 */
const pack = <span data-pack-key>this pack</span>;

const compassIcon = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" />
    <path d="M10.4 5.6L9 9 5.6 10.4 7 7z" />
  </svg>
);

const searchIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

/* The three glyphs G-90 added to the top bar, copied from the shipped markup
   rather than redrawn: element order inside an svg is part of what
   test/markup-parity.test.mjs compares. */
const themeIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="8" cy="8" r="3.2" />
    <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2L3.1 3.1" />
  </svg>
);

const bellIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M4 6.6a4 4 0 018 0c0 3 1 3.9 1 3.9H3s1-.9 1-3.9z" />
    <path d="M6.6 12.8a1.6 1.6 0 002.8 0" />
  </svg>
);

const accountIcon = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="8" cy="5.6" r="2.6" />
    <path d="M2.9 13.4a5.4 5.4 0 0110.2 0" />
  </svg>
);

/**
 * The top bar, and it grew at G-90.
 *
 * The product added a theme toggle and two top-bar menus, and this composition
 * had to follow or the parity case goes red — which is exactly what it did when
 * the kit re-vendored: the shipped top bar had three controls the composed one
 * did not. That failure is the composed screen doing its job.
 *
 * Both popovers are composed CLOSED, as the product ships them. The normalizer
 * drops hidden elements, so what the parity case compares here is the wrapper
 * and its trigger; the panels themselves are compared by their own revealed
 * cases in test/markup-parity.test.mjs.
 *
 * Every entry is unavailable with a stated reason, which is how the product
 * ships all seven of them: nothing here has heard from a server, so nothing here
 * may look available.
 */
export function TopBar() {
  return (
    <ShellTop>
      <MenuButton aria-label="Open menu" />
      <Seal />
      <BrandCity>
        <data data-pack-name="">This city</data>
      </BrandCity>
      <EnvBadge environment="demo">Demo</EnvBadge>
      <Grow as="div" />
      <SearchField icon={searchIcon} notBuilt="Not built">
        <Input
          type="search"
          placeholder="Search records, parcels, cases"
          aria-label="Record search"
          disabled
        />
      </SearchField>
      <CompassSource scope="This city · Overview" aria-expanded="false" aria-controls="cp-sheet">
        {compassIcon}
      </CompassSource>
      <Button kind="ghost" size="sm" title="Switch to the light theme">
        {themeIcon}
        <span>Light</span>
      </Button>
      <TopMenu>
        <Button kind="ghost" size="sm" aria-label="Notifications" aria-expanded="false">
          {bellIcon}
        </Button>
        <Pop label="Notifications">
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
      </TopMenu>
      <TopMenu>
        <Button kind="ghost" size="sm" aria-label="Account" aria-expanded="false">
          {accountIcon}
        </Button>
        <Pop label="Account">
          <PanelHead title="Session not read">
            <Pill>Anonymous</Pill>
          </PanelHead>
          <PanelBody flush>
            <PopGroup basis="not read" />
            <PopGroup>
              <PopItem unavailable="not read">My account</PopItem>
              <PopItem unavailable="not read">My profile</PopItem>
              <PopItem unavailable="not read">Account settings</PopItem>
            </PopGroup>
            <PopGroup>
              <PopItem unavailable="not read">Support</PopItem>
              <PopItem unavailable="not read">Feedback</PopItem>
            </PopGroup>
            <PopGroup>
              <PopItem unavailable="not read">Sign in</PopItem>
              <PopItem unavailable="not read">Sign out</PopItem>
            </PopGroup>
          </PanelBody>
        </Pop>
      </TopMenu>
    </ShellTop>
  );
}

/** Every lens on the roster, and whether it is built. */
const LENSES: Array<{ label: string; href: string; badge?: string; roster?: boolean }> = [
  { label: "Overview", href: "/?lens=city-manager", badge: "Empty" },
  { label: "Development services", href: "/?lens=development-services", badge: "Empty" },
  { label: "Finance", href: "/?lens=finance", badge: "Empty" },
  { label: "Citizen", href: "/?lens=citizen", badge: "Preview" },
  { label: "Public works", href: "/?lens=public-works", badge: "Not built", roster: true },
  { label: "Parks", href: "/?lens=parks", badge: "Not built", roster: true },
  { label: "Police", href: "/?lens=police", badge: "Not built", roster: true },
  { label: "Fire and EMS", href: "/?lens=fire-ems", badge: "Not built", roster: true },
  { label: "Fleet", href: "/?lens=fleet", badge: "Not built", roster: true },
];

export function Sidebar() {
  return (
    <ShellNav>
      <NavGroup label="Lenses">
        {LENSES.map((lens, i) => (
          <NavItem
            key={lens.href}
            active={i === 0}
            state={lens.roster ? "roster" : "default"}
            href={lens.href}
            badge={lens.badge}
          >
            {lens.label}
          </NavItem>
        ))}
      </NavGroup>
      <NavGroup label="Work">
        <NavItem href="/?work=review" badge="Preview">
          Plan review
        </NavItem>
        <NavItem href="/?work=files" badge="Preview">
          Files
        </NavItem>
        <NavItem state="roster" href="/?work=records" badge="Not built">
          Records search
        </NavItem>
      </NavGroup>
      <NavGroup label="City">
        <NavItem href="/?work=assets" badge="Empty">
          Assets
        </NavItem>
        <NavItem href="/?work=connections">Connections</NavItem>
        <NavItem state="roster" href="/?work=people" badge="Not built">
          People and access
        </NavItem>
      </NavGroup>
      <NavFoot>
        <Prov
          source="Sources not read"
          detail={
            <>
              {pack} <span>no grant count has been read for this pack</span>
            </>
          }
          href="/?work=connections"
        />
      </NavFoot>
    </ShellNav>
  );
}

export function OverviewHeader() {
  return (
    <PageHead>
      <Crumb>
        <b>This city</b> <span>/</span> Overview
      </Crumb>
      <TitleRow>
        <h1>Overview</h1>
        <Pill>Empty</Pill>
      </TitleRow>
      <Lede>
        Where am I, what needs me, and what is missing. Nothing on this page is a count until a
        source reads.
      </Lede>
    </PageHead>
  );
}

/** The Across departments register: every lens on the roster and whether it read. */
const REGISTER: Array<
  | { group: string }
  | { name: string; description: string; state: string; meaning: "quiet" | "restricted" }
> = [
  { group: "Built" },
  { name: "Development services", description: "Permits, inspections, licenses", state: "Not connected", meaning: "quiet" },
  { name: "Finance", description: "Adopted budget and fund ledger", state: "Not connected", meaning: "quiet" },
  { name: "Citizen", description: "Public lens, no account required", state: "Preview", meaning: "restricted" },
  { group: "Work" },
  { name: "Plan review", description: "Submittals against the adopted code", state: "Preview", meaning: "restricted" },
  { name: "Files", description: "The city private filing system", state: "Preview", meaning: "restricted" },
  { name: "Records search", description: "City document search", state: "Not built", meaning: "quiet" },
  { group: "Roster, not yet built" },
  { name: "Public works", description: "CIP, projects, reporting, phones", state: "Not built", meaning: "quiet" },
  { name: "Parks", description: "Department on the roster", state: "Not built", meaning: "quiet" },
  { name: "Police", description: "Patrol, cameras, incident log", state: "Not built", meaning: "quiet" },
  { name: "Fire and EMS", description: "Occupancies, dispatch, flood and weather", state: "Not built", meaning: "quiet" },
  { name: "Fleet", description: "Vehicles, drivers, utilisation, safety", state: "Not built", meaning: "quiet" },
  { group: "City" },
  { name: "Assets", description: "City-owned inventory", state: "Empty", meaning: "quiet" },
  { name: "Connections", description: "The function register", state: "Mounted", meaning: "restricted" },
  { name: "People and access", description: "Staff session and grants", state: "Not built", meaning: "quiet" },
];

export function OverviewLens() {
  return (
    <Lens active>
      <OverviewHeader />
      <ShellRegions>
        <ColStack>
          <MetricStrip>
            <Metric label="Needs a decision" unread="Not read" note="No operations source" />
            <Metric label="Overdue reviews" unread="Not read" note="Review mount is preview" />
            <Metric label="Permits in flight" unread="Not read" note="No permit source" />
            <Metric label="Meetings this week" unread="Not read" note="No clerk source" />
          </MetricStrip>

          <Panel>
            <PanelHead title="What needs you today">
              <Text step="caption">Decision queue</Text>
            </PanelHead>
            <State
              kicker="No live operations"
              heading={<>No decisions are waiting on {pack}.</>}
              basis={
                <>
                  no operations grant on cityKey {pack}. Gold parcel 48021:34137 is a demo fixture,
                  not a city onboarded.
                </>
              }
            >
              This queue would list items that need a call across connected departments. No
              operations feed is granted on {pack}, so there is nothing to resolve here.
            </State>
          </Panel>

          <Panel>
            <PanelHead title="Public meetings">
              <Prov source="City clerk calendar" detail={<span>unread</span>} />
            </PanelHead>
            <State
              kicker="Calendar unread"
              heading="No meeting packet has been read."
              basis="no clerk calendar grant has been read for this pack"
            >
              Public meetings list files records from a clerk calendar grant. No clerk source is
              granted on {pack}, so this panel stays empty rather than showing another city&apos;s
              sessions.
            </State>
          </Panel>

          <Panel>
            <PanelHead title="Across departments">
              <Text step="caption">Every lens on the roster, and whether it read</Text>
            </PanelHead>
            <PanelBody flush>
              {REGISTER.map((row, i) =>
                "group" in row ? (
                  <RegisterGroup key={`g${i}`}>{row.group}</RegisterGroup>
                ) : (
                  <SourceRow key={row.name} name={row.name} description={row.description}>
                    <Pill meaning={row.meaning}>{row.state}</Pill>
                  </SourceRow>
                ),
              )}
            </PanelBody>
          </Panel>
        </ColStack>

        <ColStack rail>
          <Region>
            <RegionBar title="The city">
              <Text step="caption">SmartSite</Text>
              <Button kind="ghost" size="sm" data-stage-present="map">
                Expand
              </Button>
              <Button kind="ghost" size="sm" data-stage-max="map">
                Full
              </Button>
            </RegionBar>
            <RegionCanvas data-stage="map">
              <MountNote>The city map mounts here.</MountNote>
            </RegionCanvas>
            <RegionFoot>
              <Text step="data">48021:34137</Text>
              <Text step="caption">Demo fixture</Text>
              <Grow />
              <Prov source="Public record" />
            </RegionFoot>
          </Region>

          <Panel>
            <PanelHead title="Sources">
              <Prov source="Not read" />
            </PanelHead>
            <PanelBody>
              <Text step="caption" as="p">
                County parcel record is the map subject. The records panel and the files room stay
                honest when the mount is empty.
              </Text>
              {/* The slot the product leaves for a record summary. Visible and
                  empty rather than absent, because the panel has to be able to
                  say that nothing was read. */}
              <Text step="data" as="p" />
            </PanelBody>
          </Panel>
        </ColStack>
      </ShellRegions>
    </Lens>
  );
}

export function CompassPanel() {
  return (
    <CompassSheet>
      <CompassInner>
        <CompassHead>
          <CompassGrab title="Drag to dismiss" />
          <Text step="label">Compass</Text>
          <Grow />
          <Pill>Chrome only</Pill>
          <Button kind="ghost" size="sm">
            Close
          </Button>
        </CompassHead>
        <CompassScope>
          <Prov source="This city" detail="Overview" />
          <EnvBadge environment="demo">Demo</EnvBadge>
        </CompassScope>
        <CompassThread>
          <CompassTurn>
            Compass follows the current city and lens. It is a source control, not a page and not a
            route.
          </CompassTurn>
          <CompassNote>
            Answers are not generated on this card, so there is no maximize control and no composer.
            The sheet is chrome until the answer engine is built.
          </CompassNote>
        </CompassThread>
      </CompassInner>
    </CompassSheet>
  );
}

/** The whole staff shell with the Overview lens active. */
export function OverviewScreen() {
  return (
    <Shell>
      <ShellRecede>
        <TopBar />
        <ShellBody>
          <Sidebar />
          <ShellMain>
            <OverviewLens />
          </ShellMain>
        </ShellBody>
      </ShellRecede>
    </Shell>
  );
}

/** Named so the harness and the parity test read the same list. */
export const SCREENS: Array<{ id: string; title: string; mirrors: string; node: React.ReactNode }> = [
  {
    id: "overview",
    title: "Overview, city-manager lens",
    mirrors: "smartcity-dashboards web/index.html, section#lens-city-manager",
    node: <OverviewScreen />,
  },
];

/** Re-exported so the gallery can show the basis line beside a composed screen. */
export { Basis };
