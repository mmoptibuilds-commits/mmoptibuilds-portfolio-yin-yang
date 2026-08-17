<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# mmoptibuilds — working notes

Read `README.md` first for how to run, build and deploy. This file covers the
decisions and the traps, so a future session does not undo them.

## Source of truth

The business specification is the roadmap delivery package, downloaded to
`.spec/unpacked/` (git-ignored). 32 numbered documents. When copy, scope or
architecture is in question, that package decides — not preference.

The rules that matter most, from spec 01:

- **No invented proof.** No testimonials, clients, awards, certifications,
  stock, distributor relationships, savings, delivery times or performance
  figures. There are none yet. Do not add placeholders "to fill the grid".
- **No public prices.** Systems holds no stock; availability, warranty, tax and
  freight are confirmed before a quote. Nothing may imply otherwise.
- **Enterprise is supply only.** No installation, rack work or network config.
- **Coldharbour is an independent project**, not client work, and is labelled
  as such visibly wherever it appears.

## Verify before claiming

`npm run verify` runs nine gates against a real production build. Use it.
Everything below was found by running the site, not by reading the code — most
of it looked correct on the page and was wrong underneath.

## Traps in this codebase

**Division scopes must re-apply inherited properties.** `.division-systems` and
`.division-studio` redeclare tokens, but `color` and `font-family` inherit as
*computed* values. A scope that only sets `--ink` leaves children with the outer
division's colour; a `font-family: var(--font-text-stack)` on `<body>` cannot
resolve at all, because the stack is declared on the scope below. Both shipped
as bugs. Set these on the scope, never on `body`.

**`cn()` is configured, not decorative.** `lib/cn.ts` extends tailwind-merge
with this project's `text-*` colour and font-size groups. Without it,
`cn("text-accent-contrast", "text-step-0")` looks like two font sizes and the
colour is silently dropped — that shipped 3.17:1 text on the Studio submit
button. Adding a new colour or type step means adding it there too.
`tests/cn.test.ts` pins this.

**Reveals never animate opacity.** `[data-reveal]` animates transform only. See
the comment in `app/globals.css`. If you make a reveal fade in, below-fold copy
becomes invisible without JavaScript, in print, and whenever the scroll timeline
stalls. `scripts/keyboard.mjs` checks the no-JS case.

**Abuse controls run after validation** in `app/actions/enquiry.ts`. Reversing
that order means a real person submitting an incomplete form inside the
2.5-second window gets a fake "Received" and their enquiry is discarded.

**Client Components must import from `lib/enquiry-fields.ts`, never
`lib/enquiry-schema.ts`.** The schema module pulls in Zod; the fields module is
plain data. Getting this wrong adds ~64KB to `/contact` and breaks the bundle
gate.

**Monospace needs a smaller type-scale minimum than a proportional face.** The
top three steps' clamp minimums are set by IBM Plex Mono's advance width so a
13-character word fits at 320px. Raising them reintroduces horizontal overflow.

**Desktop navigation switches at `lg`, not `md`.** Four nav items plus a
division switcher plus a CTA do not fit in 768px.

**Windows: `kill()` on a shell-spawned server leaves the real process
listening.** A stale server then serves the previous build's HTML against the
current build's chunk hashes, producing 500s on assets that look exactly like an
application bug. Two false failures traced to this. `scripts/verify.mjs` uses
`taskkill /T` and refuses to start if the port is occupied.

**Git Bash rewrites arguments starting with `/`** into filesystem paths. That is
why `scripts/shots.mjs` takes routes without leading slashes via `ROUTES`, with
`home` meaning `/`.

## Decisions worth not re-opening

**No animation library.** `gsap`, `@gsap/react` and `motion` were installed and
never imported; they were removed. Section reveals are CSS scroll-driven
timelines, hover and press are CSS transitions, and the one cinematic moment
(the gateway seam) is a CSS keyframe. Adding GSAP back needs a sequence that CSS
genuinely cannot express — not the fact that it was in the original brief.

**No dialog library.** The mobile sheet is a native `<dialog>` with
`showModal()`, which provides focus trapping, Escape, inert background,
implicit `aria-modal` and focus restoration on the platform. Replacing Radix
with it removed ~17KB compressed and brought first-load JS from 177KB to 165KB,
under the 170KB budget, with every behaviour still verified in
`scripts/keyboard.mjs`. Scroll lock is one `:has()` rule.

**No WebGL, no custom cursor, no smooth-scroll library.** Nothing on this site
needs them, and the spec gates each behind a performance review. A shader that
weakens the site is a failure, not a feature.

**One canonical `/contact`** with the intent chosen by query string, rather than
three URLs for one purpose. The links are real links, so each is bookmarkable
and works without JavaScript.

**Forms are Server Actions, not route handlers**, so they submit without client
JavaScript and Next handles the origin check.

## Current state

All nine gates pass. 0 axe violations across 14 routes; no overflow across 16
routes × 11 viewports; LCP 128–224ms, CLS 0.000; first-load JS 149–165KB
compressed.

Not done, and deliberately so:

- Owner email notifications. Enquiries are visible in `/admin` without them, and
  the spec treats free Supabase SMTP as unsuitable for production.
- Real Supabase and Turnstile credentials. Both are env-driven and inert until
  configured; the file backend covers development.
- Professional India legal review of privacy, GST, warranty and contract terms.
  The legal pages describe actual behaviour accurately and mark what needs a
  lawyer rather than inventing clauses.
- `/systems/servers`, `/systems/storage`, `/systems/networking` and
  `/systems/builder`. Spec 05 defers these until each has authoritative copy and
  distinct search value.
