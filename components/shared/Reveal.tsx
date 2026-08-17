import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  /**
   * Stagger position within a row. Offsets the scroll range slightly so
   * side-by-side items resolve in sequence rather than together.
   */
  index?: number;
  as?: "div" | "li" | "section" | "article" | "header" | "figure";
  className?: string;
};

/**
 * The one reveal used across the site. A server component with no JavaScript.
 *
 * Driven by a CSS scroll-driven animation (`animation-timeline: view()`).
 * That matters for more than bundle size: an earlier version used
 * `whileInView`, which server-rendered `opacity: 0` inline and only became
 * visible after hydration — so on a slow connection, a JS error, or with
 * scripting disabled, the copy stayed blank. Here the element is visible in
 * the HTML by default and the animation is purely additive, applied only
 * where it is supported and only when motion is welcome.
 */
export function Reveal({ children, index = 0, as = "div", className }: RevealProps) {
  const Tag = as;
  return (
    <Tag
      data-reveal=""
      className={cn(className)}
      style={index ? ({ "--reveal-i": index } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
