/**
 * Systems copy.
 *
 * Every claim here is traceable to spec 01 (source of truth) or spec 09
 * (content framework). Constraints that shaped the wording:
 *
 *   - No stock is held, so nothing may imply availability.
 *   - No public pricing, so nothing may imply a price or a saving.
 *   - Enterprise is sourcing and delivery only — no installation or rack work.
 *   - No invented benchmarks, delivery times, distributor names or clients.
 *
 * Voice per spec 07: direct and factual. No "ultimate", no "unbeatable", no
 * superlatives that cannot be checked.
 */

export type SpecRow = { label: string; value: string; note?: string };

export type SystemsPage = {
  slug: string;
  /** Nav and breadcrumb label. */
  label: string;
  /** <title>. */
  metaTitle: string;
  metaDescription: string;
  /** H1. Kept short enough to set at display scale without wrapping badly. */
  h1: string;
  /** One sentence under the H1. The offer, in plain words. */
  standfirst: string;
  /** Who the page is for. Rendered as a definition list, not marketing bullets. */
  audience: string[];
  /** The questions a real quote depends on. This is the page's substance. */
  questions: { q: string; why: string }[];
  /** What is explicitly not offered. Trust comes from stated boundaries. */
  boundaries: string[];
  /** Instrument readout beside the heading. Facts only. */
  readout: SpecRow[];
  /** heading is the section statement; label is the button verb. They must
   *  differ, or the section reads its own name twice. */
  cta: { heading: string; label: string; sub: string };
  /** Which enquiry form this page routes into. */
  intent: "system-build" | "enterprise-rfq";
};

export const systemsOverview = {
  metaTitle: "Computer systems built around the requirement | mmoptibuilds Systems",
  metaDescription:
    "Custom PCs, workstations, business systems and exact-spec enterprise hardware, sourced from Indian distributors after your requirements are confirmed. Quote-first, no stock held. Bengaluru.",
  h1: "Hardware that starts with the requirement.",
  standfirst:
    "No stock, no shelf bundles, no public price list. You describe what the machine has to do; the parts are confirmed with distributors and then quoted.",
  /** The reason the model is the way it is. Answers "why no prices?" up front. */
  rationale: [
    {
      heading: "Why there is no price list",
      body: "Component pricing in India moves with import duty, distributor allocation and the exchange rate. A published price would be wrong within a week, and wrong in a way that costs you. Availability, warranty terms, tax treatment and delivery are confirmed first, then you get one figure that holds.",
    },
    {
      heading: "Why nothing is in stock",
      body: "Holding stock means selling what was bought, not what you need. Sourcing after the requirement is slower to quote and better to own. The exception is nothing — this applies to a single gaming build and a fifty-drive storage order alike.",
    },
    {
      heading: "What assembly includes",
      body: "For complete PCs: build, cable routing, firmware and BIOS configuration, thermal and stability testing under sustained load, and an OS install if you want one. For enterprise orders, supply is sourcing and delivery only.",
    },
  ],
  paths: [
    {
      label: "Gaming PCs",
      href: "/systems/gaming-pcs",
      line: "Specified around the games, the resolution and the frame rate you actually want.",
    },
    {
      label: "Workstations",
      href: "/systems/workstations",
      line: "Specified around the render, compile, simulation or model you are waiting on.",
    },
    {
      label: "Enterprise hardware",
      href: "/systems/enterprise-hardware",
      line: "Exact-spec sourcing from a part number. Servers, storage, switches, optics, racks.",
    },
  ],
} as const;

export const systemsPages: SystemsPage[] = [
  {
    slug: "gaming-pcs",
    label: "Gaming PCs",
    intent: "system-build",
    metaTitle: "Custom gaming PC builds, specified and sourced | mmoptibuilds",
    metaDescription:
      "Custom gaming PCs specified around the games, resolution and frame rate you play at, then sourced from Indian distributors and quoted. Assembly and stability testing available. Bengaluru.",
    h1: "A gaming PC specified around what you actually play.",
    standfirst:
      "Tell me the games, the monitor and the frame rate you are aiming at. The build is specified from that, not from a tier list.",
    audience: [
      "Players who know what they want to run but not which parts get them there",
      "Anyone who has been quoted a build that looks like it was copied from a template",
      "People upgrading part of an existing machine rather than replacing all of it",
    ],
    questions: [
      {
        q: "Which games, and at what resolution and refresh rate?",
        why: "A machine for 1080p esports at 240Hz and a machine for 4K single-player are different builds at a similar price. This is the single most useful thing you can tell me.",
      },
      {
        q: "Is anything else running on it?",
        why: "Streaming, recording, editing the footage afterwards, or a second monitor doing something useful all change the CPU and memory decision.",
      },
      {
        q: "What do you already own?",
        why: "A good monitor, a working PSU of known quality, or a case you like are all worth building around. So is a drive with your library on it.",
      },
      {
        q: "What is the private budget range?",
        why: "A range, not a number — and it stays private. It decides where the money goes, which matters more than the total. Saying \"not decided\" is a valid answer.",
      },
      {
        q: "Assembled and tested, or parts only?",
        why: "Both are available. Assembly includes cable routing, BIOS and firmware setup, and sustained-load thermal and stability testing before it ships.",
      },
    ],
    boundaries: [
      "No price is quoted before distributor availability and warranty terms are confirmed",
      "No frame-rate promise — component behaviour depends on your settings, drivers and title",
      "No overclocking beyond validated manufacturer profiles unless agreed in writing",
    ],
    readout: [
      { label: "Starts from", value: "A requirement" },
      { label: "Stock held", value: "None" },
      { label: "Assembly", value: "Optional" },
      { label: "Load testing", value: "Included", note: "on assembled builds" },
    ],
    cta: {
      heading: "No shelf bundle, no guesswork.",
      label: "Describe the build",
      sub: "Nine questions, most of them optional. No account, no email verification.",
    },
  },
  {
    slug: "workstations",
    label: "Workstations",
    intent: "system-build",
    metaTitle: "Workstations for editing, 3D, CAD, simulation and AI | mmoptibuilds",
    metaDescription:
      "Workstations specified around your actual workload — render, compile, simulation, timeline or training — then sourced and quoted. For creators, engineers and studios in India.",
    h1: "A workstation specified around the thing you are waiting on.",
    standfirst:
      "Every professional workload has one step that wastes your day. The build is specified to shorten that step, not to score well on a benchmark you never run.",
    audience: [
      "Editors and colourists whose timelines stop being real-time",
      "3D and VFX artists waiting on renders, simulations or viewport performance",
      "Engineers and architects running CAD, CAM, FEA or CFD",
      "Developers with long compile or test cycles, and teams training models locally",
    ],
    questions: [
      {
        q: "Which software, and which version?",
        why: "Licensing, GPU acceleration and core-count scaling differ sharply between applications and between versions of the same application. This decides more of the build than the budget does.",
      },
      {
        q: "What is the slow step?",
        why: "Export, render, simulate, compile, scrub, train, or open the file at all. Different bottlenecks point at different components, and some point at storage rather than the processor.",
      },
      {
        q: "How large is a working file or dataset?",
        why: "It sets memory capacity and the storage tier. A 400GB dataset and a 4GB one are different machines even with the same processor.",
      },
      {
        q: "Certified drivers, or is consumer hardware acceptable?",
        why: "Some vendors only support certified configurations. If your support contract depends on it, that constrains the parts list before anything else does.",
      },
      {
        q: "Noise, size or power limits?",
        why: "A workstation beside a microphone, in a rack, or on a domestic circuit has real constraints. Better to design around them than to discover them.",
      },
    ],
    boundaries: [
      "No performance figure is promised for your project files or scenes",
      "Software licensing and vendor certification remain your responsibility",
      "No on-site installation, network deployment or managed infrastructure",
    ],
    readout: [
      { label: "Specified for", value: "One bottleneck" },
      { label: "Certified parts", value: "On request" },
      { label: "Stock held", value: "None" },
      { label: "Assembly", value: "Optional" },
    ],
    cta: {
      heading: "Shorten the step you are waiting on.",
      label: "Describe the workload",
      sub: "The software and the slow step are the two that matter most.",
    },
  },
  {
    slug: "enterprise-hardware",
    label: "Enterprise hardware",
    intent: "enterprise-rfq",
    metaTitle: "Exact-spec enterprise hardware sourcing and RFQ | mmoptibuilds",
    metaDescription:
      "Exact-spec sourcing for servers, storage, enterprise drives, switches, SFP optics and racks. Submit a part number and quantity; receive a quote with warranty, condition and tax terms stated. India.",
    h1: "Exact-spec sourcing, from a part number.",
    standfirst:
      "For procurement that already knows the specification. Send the part number, quantity and required date; you get availability, condition, warranty and tax terms in writing.",
    audience: [
      "Procurement and IT teams with an approved specification and a PO process",
      "Businesses replacing or expanding existing server, storage or network hardware",
      "Anyone who has been sent an \"equivalent\" part they did not ask for",
    ],
    questions: [
      {
        q: "Manufacturer, model and exact part number or SKU",
        why: "Enterprise SKUs differ by firmware, interface, cache, bracket and region. A part number is the specification; a description is a guess.",
      },
      {
        q: "Quantity, and whether a partial fill is acceptable",
        why: "Distributor allocation is frequently the constraint. Knowing whether 8 of 12 is useful to you changes what can be offered.",
      },
      {
        q: "Acceptable condition",
        why: "New, refurbished or open-box carry different warranty and price. Stating what you will accept prevents a quote you have to reject.",
      },
      {
        q: "Warranty and support requirement",
        why: "Manufacturer warranty, distributor warranty and next-business-day support are different products with different lead times.",
      },
      {
        q: "Delivery location, required date, and PO or tax invoice needs",
        why: "GST treatment, PO referencing and logistics all have to be right on the paperwork the first time. Tell me the constraints and they will be on the quote.",
      },
    ],
    boundaries: [
      "Sourcing and delivery only — no installation, rack work, cabling or network configuration",
      "No compatibility guarantee between parts you specify and equipment already in service",
      "No availability or lead time is stated before it is confirmed with a distributor",
      "Grey-market and parallel-import stock is not supplied",
    ],
    readout: [
      { label: "Scope", value: "Supply only" },
      { label: "Starts from", value: "A part number" },
      { label: "Conditions", value: "As specified" },
      { label: "Paperwork", value: "PO / GST" },
    ],
    cta: {
      heading: "Send the part number.",
      label: "Submit an RFQ",
      sub: "Part number, quantity and required date is enough to begin.",
    },
  },
];

export function systemsPageBySlug(slug: string) {
  return systemsPages.find((p) => p.slug === slug);
}
