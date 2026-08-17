import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

/**
 * Regression tests for the class merger.
 *
 * These pin a real shipped defect: tailwind-merge treated `text-accent-contrast`
 * and `text-step-0` as the same class group, dropped the colour, and put
 * near-black text on the rust Studio button at 3.17:1 contrast. The class was
 * present in the source and absent from the DOM, which is the hardest kind of
 * bug to notice by reading code.
 */

describe("cn", () => {
  it("keeps a colour and a font size together — the shipped bug", () => {
    const out = cn("text-accent-contrast", "text-step-0");
    expect(out).toContain("text-accent-contrast");
    expect(out).toContain("text-step-0");
  });

  it("keeps them together in the other order too", () => {
    const out = cn("text-step-0", "text-accent-contrast");
    expect(out).toContain("text-accent-contrast");
    expect(out).toContain("text-step-0");
  });

  it("still resolves a genuine font-size conflict, last one winning", () => {
    expect(cn("text-step-0", "text-step-4")).toBe("text-step-4");
  });

  it("still resolves a genuine colour conflict, last one winning", () => {
    expect(cn("text-ink-muted", "text-accent")).toBe("text-accent");
  });

  it("handles the negative step in the scale", () => {
    const out = cn("text-ink", "text-step--1");
    expect(out).toContain("text-ink");
    expect(out).toContain("text-step--1");
  });

  it("does not confuse a background colour with a text colour", () => {
    const out = cn("bg-accent", "text-accent-contrast");
    expect(out).toContain("bg-accent");
    expect(out).toContain("text-accent-contrast");
  });

  it("merges conditional and falsy values like clsx", () => {
    expect(cn("text-ink", false, undefined, null, "text-accent")).toBe("text-accent");
  });

  it("leaves unrelated utilities alone", () => {
    const out = cn("flex min-h-11 items-center", "text-step-0", "text-accent");
    expect(out).toContain("flex");
    expect(out).toContain("min-h-11");
    expect(out).toContain("items-center");
    expect(out).toContain("text-step-0");
    expect(out).toContain("text-accent");
  });
});
