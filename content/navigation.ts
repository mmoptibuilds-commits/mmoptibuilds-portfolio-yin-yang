import type { DivisionKey } from "@/lib/site";

export type NavItem = { label: string; href: string; description: string };

export const systemsNav: NavItem[] = [
  {
    label: "Gaming PCs",
    href: "/systems/gaming-pcs",
    description: "Built around the games and settings you actually play at.",
  },
  {
    label: "Workstations",
    href: "/systems/workstations",
    description: "Specified around your render, compile or simulation workload.",
  },
  {
    label: "Enterprise",
    href: "/systems/enterprise-hardware",
    description: "Exact-spec sourcing from a part number or specification.",
  },
];

export const studioNav: NavItem[] = [
  {
    label: "Business sites",
    href: "/studio/business-websites",
    description: "A credible, clear website for an established business.",
  },
  {
    label: "Startup sites",
    href: "/studio/startup-websites",
    description: "A launch site for a company that needs to be taken seriously.",
  },
  {
    label: "Redesign",
    href: "/studio/website-redesign",
    description: "Replacing a site that no longer represents the business.",
  },
  {
    label: "Work",
    href: "/studio/work",
    description: "Projects and clearly labelled concepts.",
  },
];

export function navFor(division: DivisionKey): NavItem[] {
  return division === "systems" ? systemsNav : studioNav;
}

/** Shown in the footer of both divisions. Admin is deliberately absent. */
export const universalNav: NavItem[] = [
  { label: "About", href: "/about", description: "Who runs mmoptibuilds and how it works." },
  { label: "Contact", href: "/contact", description: "Start an enquiry." },
];

export const legalNav: NavItem[] = [
  { label: "Privacy", href: "/privacy", description: "What is collected and why." },
  { label: "Terms", href: "/terms", description: "Website and enquiry terms." },
];
