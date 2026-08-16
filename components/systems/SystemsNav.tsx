"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { systemsNav } from "@/content/navigation";

/**
 * Systems desktop navigation.
 *
 * Presented as an instrument panel: mono labels, uppercase, tracked out, with
 * the active route marked by a tick above the label rather than an underline.
 * Client component only because it reads the current path.
 */
export function SystemsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Systems" className="hidden md:block">
      <ul className="flex items-stretch">
        {systemsNav.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "label-instrument relative flex min-h-11 items-center px-4",
                  "transition-colors duration-(--duration-micro)",
                  active ? "text-accent" : "text-ink-muted hover:text-ink",
                )}
              >
                {/* Active tick — decorative; aria-current carries the meaning. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-0 left-4 h-1.5 w-4 origin-left bg-accent",
                    "transition-transform duration-(--duration-ui) ease-(--ease-mech)",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
