"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { duration, ease, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Stagger position within a group. */
  index?: number;
  /** Distance travelled, in px. Keep small; large travel reads as cheap. */
  distance?: number;
  as?: "div" | "li" | "section" | "article" | "header" | "figure";
  className?: string;
};

/**
 * The one reveal used across the site.
 *
 * Content is server-rendered and present in the DOM regardless — this only
 * resolves its arrival. Under reduced motion the element renders in place
 * with no transform and no opacity ramp, so hierarchy and reading order
 * survive intact rather than the reveal being crudely stripped.
 */
export function Reveal({
  children,
  index = 0,
  distance = 14,
  as = "div",
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{
        duration: duration.uiLg,
        ease: ease.outExpo,
        delay: index * 0.055,
      }}
    >
      {children}
    </MotionTag>
  );
}
