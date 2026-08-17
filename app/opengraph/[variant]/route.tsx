import { ImageResponse } from "next/og";
import { divisions, site } from "@/lib/site";

/**
 * Social cards, generated rather than designed as static files.
 *
 * Three variants, one per art direction, so a shared link looks like the page
 * it points at. `force-static` plus generateStaticParams means these are
 * rendered at build time and served as static assets.
 *
 * Deliberately no webfont fetch: next/og would need the font binary available
 * at render time, and a system-stack card that always renders beats a bespoke
 * card that occasionally fails. The composition carries the identity.
 */

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ variant: "gateway" }, { variant: "systems" }, { variant: "studio" }];
}

const PALETTE = {
  gateway: { bg: "#0b0c0d", ink: "#edeff1", muted: "#9ba3aa", accent: "#2fd8e4" },
  systems: { bg: "#0b0c0d", ink: "#edeff1", muted: "#9ba3aa", accent: "#2fd8e4" },
  studio: { bg: "#f4efe6", ink: "#16130f", muted: "#55504a", accent: "#b8371a" },
} as const;

type Variant = keyof typeof PALETTE;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ variant: string }> },
) {
  const { variant: raw } = await params;
  const variant = (raw in PALETTE ? raw : "gateway") as Variant;
  const c = PALETTE[variant];

  const headline =
    variant === "systems"
      ? divisions.systems.proposition
      : variant === "studio"
        ? divisions.studio.proposition
        : site.tagline;

  const label =
    variant === "systems"
      ? "Division 01 — Systems"
      : variant === "studio"
        ? "Division 02 — Studio"
        : "Bengaluru, India";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: c.bg,
          padding: "72px 80px",
          fontFamily: variant === "studio" ? "Georgia, serif" : "monospace",
        }}
      >
        {/* Mark: three stacked bars, the same geometry as the site's SVG. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ width: 96, height: 10, background: c.ink }} />
          <div style={{ width: 62, height: 10, background: c.ink }} />
          <div style={{ width: 34, height: 10, background: c.accent }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: variant === "studio" ? 62 : 54,
              lineHeight: 1.05,
              color: c.ink,
              letterSpacing: variant === "studio" ? "-0.02em" : "-0.03em",
              textTransform: variant === "studio" ? "none" : "uppercase",
              maxWidth: 940,
            }}
          >
            {headline}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontSize: 24,
              color: c.muted,
              letterSpacing: variant === "studio" ? "0.02em" : "0.14em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: c.accent }}>mmoptibuilds</span>
            <span style={{ width: 1, height: 22, background: c.muted }} />
            <span>{label}</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
