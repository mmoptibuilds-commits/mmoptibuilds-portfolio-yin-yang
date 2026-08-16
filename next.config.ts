import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Pin the workspace root. A stray lockfile in a parent directory otherwise
  // makes Turbopack guess, and the guess is not stable across machines.
  turbopack: { root: import.meta.dirname },

  // Cloudflare Workers via OpenNext serves the built output; keep images
  // unoptimized-free by using the default loader with explicit sizes.
  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        // The owner dashboard must never be indexed or cached, per spec 10.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
