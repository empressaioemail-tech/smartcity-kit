import * as React from "react";
import { NavFoot, NavGroup, NavItem, Prov, ShellNav } from "@empressaio/smartcity-kit";

const pack = <span data-pack-key>this pack</span>;

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

/**
 * The primary sidebar. `open` is the narrow-viewport sheet state the product
 * toggles below the breakpoint — the capture width sits on that breakpoint, so
 * Primary is the open roster the staff actually see.
 */
export const Primary = () => (
  <ShellNav open>
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

export const City = () => (
  <ShellNav open>
    <NavGroup label="City">
      <NavItem href="/?work=assets" badge="Empty">
        Assets
      </NavItem>
      <NavItem href="/?work=connections">Connections</NavItem>
      <NavItem state="roster" href="/?work=people" badge="Not built">
        People and access
      </NavItem>
    </NavGroup>
  </ShellNav>
);
