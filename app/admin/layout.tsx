import type { Metadata } from "next";
import { systemsFontClass } from "@/lib/fonts-systems";

/**
 * Admin layout.
 *
 * `noindex, nofollow` is set here rather than per page so a future admin route
 * cannot be added without it. robots.txt also disallows /admin, but that is a
 * crawl hint; this is the header that actually keeps it out of an index if it
 * is ever linked from elsewhere.
 *
 * Uses the Systems material because this is instrumentation, not editorial.
 */
export const metadata: Metadata = {
  title: "Owner console | mmoptibuilds",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${systemsFontClass} division-systems min-h-dvh bg-surface text-ink`}>
      {children}
    </div>
  );
}
