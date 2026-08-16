import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif, Archivo } from "next/font/google";

/**
 * Four families total, but only two ever load per division because each
 * division layout applies its own pair. Systems reads as instrumentation
 * (mono display over neutral sans); Studio reads as editorial (high-contrast
 * serif display over a grotesque).
 *
 * next/font downloads and self-hosts at build time, emits a size-adjusted
 * fallback to keep CLS at zero, and subsets to latin only.
 *
 * IBM Plex Sans and Archivo ship variable versions, so weight is omitted to
 * get the whole wght axis in one file. IBM Plex Mono and Instrument Serif are
 * static, so their weights are listed explicitly — Instrument Serif only
 * exists at 400.
 */

// ── Systems: instrumentation ──────────────────────────────────────────────
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-systems-display",
});

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-systems-text",
});

// ── Studio: editorial ─────────────────────────────────────────────────────
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-studio-display",
});

export const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-studio-text",
});

export const systemsFontClass = `${plexMono.variable} ${plexSans.variable}`;
export const studioFontClass = `${instrumentSerif.variable} ${archivo.variable}`;
/** The gateway shows both materials side by side, so it needs all four. */
export const gatewayFontClass = `${systemsFontClass} ${studioFontClass}`;
