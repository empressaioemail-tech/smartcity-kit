/**
 * @empressaio/smartcity-kit
 *
 * A typed React wrapper over the SmartCity class vocabulary. It renders the
 * classes the product already ships and owns no styling: no token, no colour,
 * no radius, no duration, no type step is declared here. `sc-kit.css` is the
 * single source of truth for the design and the copy in this package is a copy.
 *
 * Ruling: _decisions/2026-08-18_smartcity_kit_component_package.md
 * Design law: 30b_smartcity_design_system.md
 */

export type { Base, AnchorBase, ButtonBase, InputBase } from "./base";

export {
  Theme,
  Text,
  Grow,
  Fill,
  Button,
  ButtonLink,
  MenuButton,
  Input,
  SearchField,
} from "./primitives";
export type { TextStep, ButtonKind, ButtonSize } from "./primitives";

export { Pill, Prov, Basis, Seal, BrandCity, EnvBadge } from "./status";
export type { Meaning, ProvClaim, ProvProps } from "./status";

export {
  Panel,
  PanelHead,
  PanelBody,
  Tabs,
  Tab,
  State,
  Metric,
  MetricStrip,
} from "./surfaces";
export type { MetricProps } from "./surfaces";

export {
  DataTable,
  DataHead,
  DataHeadCell,
  DataBody,
  DataRow,
  DataCell,
  SourceRow,
  RegisterGroup,
  KeyValues,
  KeyValue,
  ActionBar,
  RosterNote,
} from "./records";
export type { CellRole, Rail } from "./records";

export {
  Shell,
  ShellRecede,
  ShellTop,
  ShellBody,
  ShellNav,
  ShellMain,
  ShellRegions,
  ColStack,
  NavGroup,
  NavItem,
  NavFoot,
  PageHead,
  Crumb,
  TitleRow,
  Lede,
  Lens,
  TabPanel,
  TopMenu,
  Pop,
  PopGroup,
  PopItem,
} from "./shell";
export type { NavState } from "./shell";

export {
  Region,
  RegionBar,
  RegionCanvas,
  RegionFoot,
  MountNote,
  Stage,
  StageScrim,
  StageEsc,
  CitizenScroll,
  CitizenColumn,
  CitizenLookup,
} from "./regions";

export {
  CompassSource,
  CompassScrim,
  CompassSheet,
  CompassInner,
  CompassHead,
  CompassGrab,
  CompassScope,
  CompassThread,
  CompassTurn,
  CompassNote,
} from "./compass";

export {
  Cite,
  ModelCite,
  AtomChip,
  UnverifiedSource,
  Matrix,
  MatrixGroup,
  MatrixRow,
  BasisLine,
  Finding,
} from "./evidence";
export type { Applicability, Confidence, BasisLineProps } from "./evidence";
