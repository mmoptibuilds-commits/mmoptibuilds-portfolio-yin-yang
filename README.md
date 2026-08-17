# mmoptibuilds

The mmoptibuilds website. One domain, two divisions:

- **Systems** — requirement-led hardware sourcing. Custom PCs, workstations,
  business systems and exact-spec enterprise procurement. No stock, no public
  prices, quote after confirmation.
- **Studio** — conversion-focused websites for businesses, startups and teams
  replacing an outdated site.

Built from the specification in the roadmap delivery package. Bengaluru, India.

---

## Running it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Copy `.env.example` to `.env.local` first if you want the owner console:

```bash
cp .env.example .env.local
```

Set `ADMIN_DEV_PASSWORD` to anything, and `/admin` will let you in with that
password. **Nothing else needs configuring to run the whole site, forms
included** — see "How enquiries are stored" below.

## Building for production

```bash
npm run build
npm run start
```

## Checking your work

```bash
npm run verify
```

This is the important one. It runs nine gates in order: typecheck, lint, unit
tests, production build, then boots a real production server and runs
accessibility, keyboard/reduced-motion/no-JS, responsive (16 routes × 11
viewports), bundle budget and Core Web Vitals against it. It exits non-zero if
anything fails, so CI can use it directly.

Individual gates, if a server is already running:

```bash
npm run typecheck
npm run lint
npm run test
npm run check:a11y         # axe + heading order + landmarks
npm run check:keyboard     # focus, Escape, scroll lock, reduced motion, no-JS
npm run check:responsive   # overflow + console errors at 11 widths
npm run check:bundle       # compressed JS per route against the budget
npm run check:perf         # LCP / CLS
```

The browser scripts take `BASE_URL` (default `http://localhost:3000`), and
`scripts/shots.mjs` takes `ROUTES` as a comma-separated list written **without
leading slashes** (`home` means `/`) — Git Bash on Windows rewrites any
argument starting with `/` into a filesystem path.

Screenshots land in `screenshots/`, which is git-ignored. They are the point of
that script; look at them.

---

## Architecture

```
app/
├── (gateway)/            /                     both materials, one seam
├── (systems)/systems/    /systems + 3 intent pages
├── (studio)/studio/      /studio + 3 intent pages, work, case study
├── (legal)/              /about, /about/story, /contact, /privacy, /terms
├── admin/                owner console (noindex, auth required)
├── opengraph/[variant]/  generated social cards
├── sitemap.ts robots.ts not-found.tsx error.tsx
components/
├── shared/               behaviour only — no visible identity
├── systems/              instrument patterns (DatumRule, nav, shell)
└── studio/               editorial patterns (MarginNote, nav, shell)
content/                  all copy, as typed data
lib/                      tokens, schemas, storage, auth, SEO helpers
supabase/migrations/      schema, RLS policies, audit triggers
scripts/                  the verification suite
```

### Two design systems, one codebase

The two divisions look like different products because they are different
businesses. `components/shared` holds behaviour and accessibility primitives
only. Anything with a visible identity lives in `components/systems` or
`components/studio`.

Semantic token *names* are shared (`bg-surface`, `text-ink`, `font-display`) so
shared components stay division-agnostic. Token *values* are redefined by
`.division-systems` and `.division-studio` in `app/globals.css`. That is what
lets one `<Field>` render as an instrument input in Systems and an editorial
input in Studio.

**A division scope must re-apply `color` and `font-family`, not only redeclare
the variables.** Both inherit as *computed* values, so a scope that only sets
`--ink` leaves descendants with the outer division's colour — and a
`font-family: var(--font-text-stack)` on `<body>` cannot resolve at all,
because the stack is declared on the scope below it. Both were real bugs.

### Motion

Three tiers, in `lib/motion.ts` and mirrored as CSS custom properties: micro
(80–250ms) for state, interface (250–700ms) for objects, cinematic (700ms+) used
once, on the gateway seam.

Section reveals are **CSS-only and transform-only** — a scroll-driven timeline
on `[data-reveal]`, no JavaScript. Opacity is deliberately not animated: an
earlier version faded from 0, which left below-fold copy blank without
JavaScript, in print, and whenever the timeline stalled. A reveal that never
runs now differs from a finished one by 14 pixels, not by absence.

There is no GSAP, and no animation library at all. Nothing here needed one; see
the decision log in `CLAUDE.md`.

### How enquiries are stored

`lib/enquiry-store.ts` picks a backend from the environment:

- **Supabase** when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` are set.
- **A local file** (`.enquiries/enquiries.json`) otherwise.

The file backend is not a stub — it validates, deduplicates, rate-limits and
issues real reference IDs, so the whole conversion path works before any
account exists. `.enquiries/` is git-ignored because it contains personal data.

All three forms share one Zod schema and one Server Action
(`app/actions/enquiry.ts`). Abuse controls run **after** validation, so a real
person who submits an incomplete form quickly always gets help with their form
rather than a silent fake success.

Field values and labels live in `lib/enquiry-fields.ts`, which has **no Zod
import**, because the forms are Client Components — importing labels from the
schema module shipped the entire validation library to the browser and put
`/contact` 64KB over budget.

### Editing content

All copy is typed data, not JSX:

- `content/systems.ts` — Systems overview and the three intent pages
- `content/studio.ts` — Studio overview, intent pages, work index, case study
- `content/navigation.ts` — navigation and footer links
- `lib/site.ts` — business facts, division propositions, consent version

Adding a new Systems or Studio intent page means adding one record to the
relevant array. The route, metadata, breadcrumbs, JSON-LD and static generation
all follow from it. Add the path to `publicRoutes` in `lib/seo.ts` so it enters
the sitemap.

**Adding a case study:** append to `workIndex` in `content/studio.ts` with an
honest `kind` and `kindLabel`, then add a page under
`app/(studio)/studio/work/<slug>/`. Use `coldharbour` as the model, including
its disclosure block. The roadmap forbids presenting a concept or an
independent project as commissioned work, and that label is rendered visibly on
both the index and the case study itself.

---

## Deploying

Production targets **Cloudflare Workers via OpenNext**. Not Vercel: the Hobby
plan's terms restrict it to non-commercial personal use.

```bash
npx wrangler login
npm run cf:preview   # build and run the Worker locally
npm run cf:deploy    # build and deploy
```

Set secrets on the Worker rather than committing them:

```bash
npx wrangler secret put SUPABASE_SECRET_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put ABUSE_FINGERPRINT_SALT
```

`NEXT_PUBLIC_*` values are inlined at build time, so they belong in the build
environment, not in secrets. `NEXT_PUBLIC_SITE_URL` **must** be the real origin
in production or every canonical URL will point at localhost.

### Supabase setup

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

Then make yourself the owner. Being signed in is not enough — membership of
`owner_accounts` is what grants access, and only the service role can write to
that table:

```sql
insert into owner_accounts (user_id, label)
values ('<your-auth-user-id>', 'founder');
```

### Before going live

The roadmap's launch gate requires items this codebase cannot satisfy on its
own:

- Professional India review of privacy, GST, warranty and contract terms. The
  privacy and terms pages describe actual system behaviour accurately and mark
  the clauses that need a lawyer — they do not invent legal language.
- A real `ABUSE_FINGERPRINT_SALT`.
- Turnstile keys, if you want the browser check enforced rather than recorded.
- Search Console verification and sitemap submission.

---

## Notes

- Node 22 or newer.
- Fonts are self-hosted via `next/font` (four families, two per division) and
  subset to latin. Display faces preload; body faces do not, because Turbopack
  merges all font CSS into one shared chunk, so preloading a body face fetches
  it on routes that never render it.
- There are no testimonials, client logos, awards or metrics anywhere on this
  site, because none exist yet. Do not add placeholders.
