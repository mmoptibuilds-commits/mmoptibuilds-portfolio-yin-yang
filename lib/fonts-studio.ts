import { Instrument_Serif, Archivo } from "next/font/google";

/**
 * Studio typography: editorial.
 *
 * Its own module for the same reason as fonts-systems.ts — so a Studio route
 * preloads the serif and the grotesque, and not the Systems mono.
 *
 * Archivo ships a variable version, so weight is omitted to get the whole wght
 * axis. Instrument Serif exists only at 400.
 */

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-studio-display",
});

export const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  /* Not preloaded, for the same reason as IBM Plex Sans — see fonts-systems.ts.
     Body copy, not the LCP element, with a size-adjusted fallback. */
  preload: false,
  variable: "--font-studio-text",
});

export const studioFontClass = `${instrumentSerif.variable} ${archivo.variable}`;
