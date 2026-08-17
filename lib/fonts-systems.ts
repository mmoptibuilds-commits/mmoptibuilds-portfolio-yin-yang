import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

/**
 * Systems typography: instrumentation.
 *
 * Deliberately its own module. next/font emits preload links for every family
 * declared in a module that is part of a route's graph — so when all four
 * families lived in one shared file, every route downloaded all six font files
 * (121KB) regardless of which two it rendered. Splitting per division means a
 * Systems route fetches Systems faces only.
 *
 * IBM Plex Sans ships a variable version, so weight is omitted to get the
 * whole wght axis in one file. IBM Plex Mono is static, so its weights are
 * listed — and only 400 and 500 are listed, because those are the only two the
 * design uses. A 600 was previously requested and never rendered.
 */

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-systems-display",
});

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  /* Not preloaded. Turbopack merges every font declaration into one shared CSS
     chunk linked from the root layout, so a per-route preload cannot be
     expressed — preloading this would fetch it on Studio routes too. It sets
     body copy rather than the LCP element, and next/font emits a size-adjusted
     fallback, so it swaps in without shifting layout (CLS stays 0.000). */
  preload: false,
  variable: "--font-systems-text",
});

export const systemsFontClass = `${plexMono.variable} ${plexSans.variable}`;
