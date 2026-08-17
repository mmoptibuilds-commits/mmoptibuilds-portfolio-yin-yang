/**
 * Studio copy.
 *
 * Constraints from spec 01, 08 and 16:
 *   - There are no clients, testimonials, awards or metrics. None may appear.
 *   - Coldharbour is an INDEPENDENT project, not commissioned work, and must
 *     be labelled as such wherever it appears (decision D-023).
 *   - Clients own their domain and hosting; access is removed at handover.
 *   - Warranty is 30 days, reproducible implementation defects only.
 *
 * Voice per spec 08: specific and conversational. No agency fog.
 */

export type StudioPage = {
  slug: string;
  label: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  standfirst: string;
  /** The situation the visitor is probably in. Written as recognition, not a pitch. */
  situation: string[];
  /** What actually gets done. Concrete deliverables, not adjectives. */
  included: { title: string; body: string }[];
  /** What this is not, and who should go elsewhere. */
  boundaries: string[];
  /** Margin notes — the Studio annotation voice. */
  notes: string[];
  cta: { label: string; sub: string };
};

export const studioOverview = {
  metaTitle: "Website design and development for businesses | mmoptibuilds Studio",
  metaDescription:
    "Conversion-focused websites for businesses, startups and teams replacing an outdated site. Accessible, fast, technically sound, and yours to own — your domain, your hosting. Bengaluru.",
  h1: "Clear enough to convert. Distinctive enough to remember.",
  standfirst:
    "Most business websites fail at one of two things: saying what the business does, or being pleasant enough to stay on. Both are solvable, and neither requires a redesign every two years.",
  /** Two modes, stated plainly, because the spec offers both. */
  modes: [
    {
      name: "Focused",
      line: "A small site that does its job properly.",
      body: "Fewer pages, written carefully, built on the same foundations as anything else here. Lean scope is not lower quality — it is less surface area. Right for a first serious website, or a business whose offer is simple and clear.",
      includes: [
        "Three to six pages, written with you",
        "Mobile-first layout and real accessibility",
        "Technical SEO and structured data",
        "One enquiry path that works",
      ],
    },
    {
      name: "Bespoke",
      line: "A site with an idea in it.",
      body: "Original art direction, motion designed for the story rather than applied to it, and custom assets. Right when the website is doing persuasive work — raising, hiring, launching, or competing against companies with larger budgets.",
      includes: [
        "Strategy and content structure from scratch",
        "Original art direction and typography",
        "Interaction and motion design",
        "Case-study or product storytelling",
      ],
    },
  ],
  /** The non-negotiable baseline, identical across both modes. Spec 01. */
  baseline: [
    "Works on a phone, on a slow connection, in one hand",
    "Keyboard navigable, screen-reader sane, WCAG 2.2 AA targeted",
    "Server-rendered content that search engines can actually read",
    "Your domain, your hosting account, your ownership",
    "Documented at handover, with deployment access removed",
    "30 days of bug fixes on reproducible implementation defects",
  ],
  paths: [
    {
      label: "Business websites",
      href: "/studio/business-websites",
      line: "For an established business whose website is quietly costing it work.",
    },
    {
      label: "Startup websites",
      href: "/studio/startup-websites",
      line: "For a company that needs to look like it will still exist next year.",
    },
    {
      label: "Redesign",
      href: "/studio/website-redesign",
      line: "For a site that works but no longer represents you.",
    },
  ],
} as const;

export const studioPages: StudioPage[] = [
  {
    slug: "business-websites",
    label: "Business websites",
    metaTitle: "Website design for small and established businesses | mmoptibuilds Studio",
    metaDescription:
      "Clear, fast, accessible websites for established businesses. Written to explain the offer and built to be found. You keep the domain and hosting. Bengaluru and remote across India.",
    h1: "A website that explains the business without you being in the room.",
    standfirst:
      "If you find yourself explaining on the phone what the website should have already said, the website is the problem.",
    situation: [
      "The site was built once, by someone who has moved on, and nobody can edit it",
      "It looks acceptable on a laptop and awkward on a phone, where most people see it",
      "It describes the company but never quite says what you sell or who it is for",
      "Enquiries arrive by phone because the contact form has never been trusted",
    ],
    included: [
      {
        title: "The offer, written down properly",
        body: "The largest gain is usually not visual. It is deciding what the first screen says, which of your services actually brings work in, and what a visitor should do next. That happens before any design.",
      },
      {
        title: "Pages built around real intent",
        body: "One page per thing people search for, each answering that question completely, each with a way to get in touch. Not one page listing nine services in a grid.",
      },
      {
        title: "An enquiry path that works",
        body: "Real labels, useful validation messages, no account required, and your typed answers preserved if something fails. Submissions arrive somewhere you will actually see them.",
      },
      {
        title: "Findable, and legibly so",
        body: "Server-rendered content, correct metadata, a sitemap, structured data that matches what is on the page, and internal links that make sense. No keyword padding.",
      },
    ],
    boundaries: [
      "No guaranteed ranking, traffic figure or conversion rate — anyone promising these is guessing",
      "No ongoing content writing or social media management",
      "A content management system is added only where you genuinely need to edit often",
    ],
    notes: [
      "Static delivery is the default. It is faster, cheaper to host and harder to break.",
      "You own the accounts from day one. Handover is a document, not a hostage negotiation.",
    ],
    cta: {
      label: "Describe the business",
      sub: "What you sell and who buys it is enough to start.",
    },
  },
  {
    slug: "startup-websites",
    label: "Startup websites",
    metaTitle: "Startup website design for launch, hiring and fundraising | mmoptibuilds Studio",
    metaDescription:
      "Launch-ready websites for startups that need to be credible to customers, candidates and investors at the same time. Built fast, built properly, and yours to own.",
    h1: "A launch site that survives being looked at closely.",
    standfirst:
      "Three audiences arrive at the same URL with different questions. Customers want to know what it does. Candidates want to know who is building it. Investors want to know whether you are serious.",
    situation: [
      "The product is real but the site is still a template with the demo copy half-replaced",
      "You are hiring, and good engineers read the website before the job post",
      "A deck exists and says it well; the website does not say it at all",
      "The launch date is close enough that a three-month build is not an option",
    ],
    included: [
      {
        title: "One clear claim",
        body: "Startups usually have too much to say and say all of it. The first job is deciding the single sentence that goes at the top, and what evidence sits directly beneath it.",
      },
      {
        title: "Proof that stands up",
        body: "Whatever is genuinely true: the product itself, a demo, the technical approach, the people. If there are no customers yet, the site says so by omission rather than by inventing logos.",
      },
      {
        title: "Built to change weekly",
        body: "Positioning will move. Content is structured so copy, sections and pages can be edited without a rebuild, and so a second product page does not require a redesign.",
      },
      {
        title: "Fast enough to not be the problem",
        body: "A launch site that takes four seconds on mobile loses the traffic you paid for. Performance is a build constraint here, not a later optimisation.",
      },
    ],
    boundaries: [
      "No fabricated customer logos, testimonials, user counts or traction figures",
      "No app or product development — this is the website, not the product",
      "Investor materials and pitch decks are not part of scope",
    ],
    notes: [
      "If you have no customers yet, saying nothing is stronger than implying otherwise. People check.",
      "A launch site should be embarrassing to nobody in six months. That is a lower bar than perfect and a higher one than fast.",
    ],
    cta: {
      label: "Start a launch brief",
      sub: "Tell me what it does and when you need it live.",
    },
  },
  {
    slug: "website-redesign",
    label: "Website redesign",
    metaTitle: "Website redesign and rebuild for outdated sites | mmoptibuilds Studio",
    metaDescription:
      "Replacing a website that no longer represents your business, without losing the search rankings and links it has earned. Redirect mapping, content audit, and a rebuild you own.",
    h1: "Replacing a site without throwing away what it earned.",
    standfirst:
      "An old website usually has something worth keeping: rankings, links, pages people still find. A redesign that ignores them costs you traffic you had already paid for.",
    situation: [
      "It was built on a platform or theme nobody supports any more",
      "It is slow, and every year it gets slower as another plugin is added",
      "It ranks for things you no longer do and none of the things you do now",
      "It cannot be edited without breaking the layout",
    ],
    included: [
      {
        title: "An audit before a design",
        body: "Which pages get traffic, which have links pointing at them, which rank and for what. That determines what is kept, merged, rewritten or retired — before a single layout decision.",
      },
      {
        title: "Redirects mapped properly",
        body: "Every retired URL gets a permanent redirect to its closest replacement. This is the step most redesigns skip, and it is why traffic falls off a cliff the week after launch.",
      },
      {
        title: "Content carried across deliberately",
        body: "Copy is rewritten where it is vague and kept where it works. Existing images are reviewed rather than replaced wholesale with stock.",
      },
      {
        title: "A rebuild, not a reskin",
        body: "New foundations: server-rendered, accessible, fast, and maintainable. A theme change on old infrastructure inherits every problem that made the site slow.",
      },
    ],
    boundaries: [
      "No promise that rankings will improve — the aim is not to lose them, and then to earn more",
      "Content migration for very large sites is scoped separately and priced separately",
      "No ongoing maintenance retainer beyond the 30-day bug-fix window",
    ],
    notes: [
      "Search Console access is genuinely useful here. Without it, the audit is educated guesswork.",
      "If the current site converts and only looks dated, say so. Sometimes the honest answer is a smaller job.",
    ],
    cta: {
      label: "Request a site review",
      sub: "Send the URL. You will get a specific answer, including if the answer is that you do not need this.",
    },
  },
];

export function studioPageBySlug(slug: string) {
  return studioPages.find((p) => p.slug === slug);
}

/* ────────────────────────────────────────────────────────────────────────────
   Work

   Per spec 16 and decision D-023, Coldharbour is an independent project.
   `kind` is rendered visibly on every card and on the case study itself, so
   the status is never ambiguous. Nothing here claims a client relationship,
   a commercial outcome, or a metric.
   ──────────────────────────────────────────────────────────────────────────── */

export type WorkKind = "independent" | "concept" | "client";

export type WorkItem = {
  slug: string;
  title: string;
  /** Shown as a visible label. Honesty is the point. */
  kind: WorkKind;
  kindLabel: string;
  year: string;
  discipline: string[];
  /** One line for the index. */
  summary: string;
  href: string;
  hasCaseStudy: boolean;
};

export const workIndex: WorkItem[] = [
  {
    slug: "coldharbour",
    title: "Coldharbour",
    kind: "independent",
    kindLabel: "Independent project",
    year: "2026",
    discipline: ["Art direction", "Front-end", "Motion"],
    summary:
      "A self-directed editorial site built to work out how far typography and scroll choreography can carry a story before images are needed.",
    href: "/studio/work/coldharbour",
    hasCaseStudy: true,
  },
];

/**
 * The Coldharbour case study.
 *
 * This is a real self-directed project. It is described as one. There are no
 * client quotes, no traffic numbers and no revenue claims, because none exist
 * — and inventing them is the one thing spec 01 rules out absolutely.
 */
export const coldharbour = {
  slug: "coldharbour",
  title: "Coldharbour",
  kindLabel: "Independent project",
  year: "2026",
  metaTitle: "Coldharbour — independent editorial site | mmoptibuilds Studio",
  metaDescription:
    "A self-directed editorial project testing how far typography, pacing and scroll choreography can carry a narrative before photography is introduced. Process, decisions and what did not work.",
  standfirst:
    "A self-directed project, not commissioned work. It exists because I wanted to find out how much of a story typography and pacing can carry on their own.",
  /** Stated immediately and unmissably. */
  disclosure:
    "Coldharbour was built independently, for myself. There was no client, no brief and no budget. Nothing on this page describes commercial results, because there are none to describe.",
  chapters: [
    {
      n: 1,
      heading: "The question",
      body: [
        "Most editorial websites lean on photography. Remove the images and what remains is usually a stack of centred paragraphs — the design was never doing the work.",
        "Coldharbour started as a constraint: build something that reads as art-directed using type, rule, space and timing only. No photographs, no illustration, no video.",
      ],
    },
    {
      n: 2,
      heading: "Constraints",
      body: [
        "One display face and one text face. Two colours plus paper. No image assets of any kind. Everything had to work at 320px and at 2560px, and had to read identically with animation switched off.",
        "The last constraint turned out to be the useful one. Designing for the reduced-motion case first meant the composition had to hold still, and the motion could only add emphasis.",
      ],
    },
    {
      n: 3,
      heading: "What the structure became",
      body: [
        "The page settled into long single-column passages interrupted by full-bleed typographic breaks. The interruptions do the pacing that images normally do — they mark a change of subject and give the eye somewhere to rest.",
        "Rules and margin notes carry the secondary information. Putting dates, references and asides in the margin instead of in parentheses shortened the main text considerably.",
      ],
    },
    {
      n: 4,
      heading: "What did not work",
      body: [
        "The first version scrubbed a scroll-linked timeline across the whole page. On a trackpad it felt precise. On a phone, with momentum scrolling, it felt broken — content arrived late and left early, and reading while scrolling was unpleasant.",
        "It was replaced with discrete reveals tied to each passage. Less impressive as a demo, better to read, and considerably less code. The scroll-linked version is the thing I would have kept if I were designing to be admired rather than read.",
      ],
    },
    {
      n: 5,
      heading: "What carried over",
      body: [
        "The margin-note pattern and the reduced-motion-first order of work are both used on this site, in the Studio division. So is the conclusion that a reveal should never animate opacity from zero — if the animation fails, the words have to still be there.",
      ],
    },
  ],
  facts: [
    { label: "Type", value: "Independent" },
    { label: "Year", value: "2026" },
    { label: "Images used", value: "None" },
    { label: "Typefaces", value: "Two" },
  ],
  stack: ["Next.js", "TypeScript", "CSS scroll-driven animation"],
} as const;
