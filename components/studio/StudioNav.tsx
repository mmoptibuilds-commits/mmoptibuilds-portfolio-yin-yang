"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { studioNav } from "@/content/navigation";

/**
 * Studio desktop navigation.
 *
 * Editorial rather than instrumental: sentence case, no tracking, and the
 * active route marked by a rule that draws in beneath the label — the
 * typographic equivalent of an editor's pen mark.
 */
export function StudioNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Studio" className="hidden md:block">
      <ul className="flex items-stretch gap-1">
        {studioNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex min-h-11 items-center px-3 text-step-0",
                  "transition-colors duration-(--duration-micro)",
                  active ? "text-accent" : "text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3 bottom-2 h-px origin-left bg-current",
                    "transition-transform duration-(--duration-ui) ease-(--ease-editorial)",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
