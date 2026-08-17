import { describe, expect, it } from "vitest";
import {
  enquirySchema,
  systemBuildSchema,
  enterpriseRfqSchema,
  studioBriefSchema,
} from "@/lib/enquiry-schema";
import {
  MIN_COMPLETION_MS,
  isEnquiryIntent,
  INTENT_DIVISION,
  BUDGET_VALUES,
  TIMING_VALUES,
} from "@/lib/enquiry-fields";

/**
 * Schema tests. These exist to pin behaviour that a well-meaning edit could
 * quietly break — particularly the rules that protect a real visitor from an
 * anti-abuse control, and the ones that keep the roadmap's trust rules true.
 */

const validBuild = {
  intent: "system-build" as const,
  name: "Test Person",
  email: "test@example.com",
  useCase: "1440p at 144Hz, competitive shooters",
  budgetRange: "100k-200k" as const,
  assembly: "assembled-tested" as const,
  deliveryCity: "Bengaluru",
  timing: "1-month" as const,
  consent: true as const,
};

describe("system build brief", () => {
  it("accepts a minimal complete submission", () => {
    expect(systemBuildSchema.safeParse(validBuild).success).toBe(true);
  });

  it("lowercases the email so duplicates collapse", () => {
    const r = systemBuildSchema.parse({ ...validBuild, email: "Test.Person@Example.COM" });
    expect(r.email).toBe("test.person@example.com");
  });

  it("requires explicit consent rather than defaulting to it", () => {
    const r = systemBuildSchema.safeParse({ ...validBuild, consent: false });
    expect(r.success).toBe(false);
  });

  it("treats every optional field as genuinely optional", () => {
    const r = systemBuildSchema.safeParse(validBuild);
    expect(r.success).toBe(true);
  });

  it("accepts 'not decided' as a budget, because the spec forbids demanding a figure", () => {
    expect(
      systemBuildSchema.safeParse({ ...validBuild, budgetRange: "not-decided" }).success,
    ).toBe(true);
  });

  it("accepts an empty renderedAt, which is what arrives when JavaScript never ran", () => {
    const r = systemBuildSchema.safeParse({ ...validBuild, renderedAt: "" });
    expect(r.success).toBe(true);
  });

  it("accepts a numeric renderedAt from a hydrated form", () => {
    const r = systemBuildSchema.safeParse({ ...validBuild, renderedAt: 1_700_000_000_000 });
    expect(r.success).toBe(true);
  });

  it("rejects an email that is missing its domain", () => {
    const r = systemBuildSchema.safeParse({ ...validBuild, email: "nope@" });
    expect(r.success).toBe(false);
  });

  it("accepts an address with a plus tag, which strict regexes wrongly reject", () => {
    expect(
      systemBuildSchema.safeParse({ ...validBuild, email: "a+tag@example.co.in" }).success,
    ).toBe(true);
  });

  it("gives a human error message, not a regex", () => {
    const r = systemBuildSchema.safeParse({ ...validBuild, email: "broken" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const msg = r.error.issues.find((i) => i.path[0] === "email")?.message ?? "";
      expect(msg).toMatch(/email address/i);
      expect(msg).not.toMatch(/regex|pattern|\\/);
    }
  });
});

describe("enterprise RFQ", () => {
  const validRfq = {
    intent: "enterprise-rfq" as const,
    name: "Proc Team",
    email: "proc@example.com",
    organisation: "Example Ltd",
    manufacturer: "Supermicro",
    partNumber: "MBD-X13SAE-F-O",
    quantity: 12,
    partialFillAccepted: "yes" as const,
    condition: "new-only" as const,
    deliveryCity: "560001",
    consent: true as const,
  };

  it("accepts a specification-led submission", () => {
    expect(enterpriseRfqSchema.safeParse(validRfq).success).toBe(true);
  });

  it("coerces a form-string quantity to a number", () => {
    const r = enterpriseRfqSchema.parse({ ...validRfq, quantity: "8" });
    expect(r.quantity).toBe(8);
  });

  it("rejects a fractional quantity", () => {
    expect(enterpriseRfqSchema.safeParse({ ...validRfq, quantity: 2.5 }).success).toBe(false);
  });

  it("rejects zero units", () => {
    expect(enterpriseRfqSchema.safeParse({ ...validRfq, quantity: 0 }).success).toBe(false);
  });

  it("requires a part number, because a description is a guess", () => {
    expect(
      enterpriseRfqSchema.safeParse({ ...validRfq, partNumber: "" }).success,
    ).toBe(false);
  });
});

describe("studio brief", () => {
  const validBrief = {
    intent: "studio-brief" as const,
    name: "Owner",
    email: "owner@example.com",
    projectType: "redesign" as const,
    businessGoal: "Stop losing enquiries to competitors who look established",
    existingAssets: "some" as const,
    hostingState: "own-domain" as const,
    budgetRange: "50k-100k" as const,
    timing: "1-3-months" as const,
    consent: true as const,
  };

  it("accepts a brief with no organisation, since sole traders exist", () => {
    expect(studioBriefSchema.safeParse(validBrief).success).toBe(true);
  });

  it("requires the business goal, which is the one question that matters", () => {
    expect(
      studioBriefSchema.safeParse({ ...validBrief, businessGoal: "   " }).success,
    ).toBe(false);
  });
});

describe("discriminated union", () => {
  it("routes on intent", () => {
    const r = enquirySchema.safeParse(validBuild);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.intent).toBe("system-build");
  });

  it("rejects an unknown intent", () => {
    expect(enquirySchema.safeParse({ ...validBuild, intent: "nonsense" }).success).toBe(false);
  });

  it("will not accept Systems fields under a Studio intent", () => {
    const r = enquirySchema.safeParse({ ...validBuild, intent: "studio-brief" });
    expect(r.success).toBe(false);
  });
});

describe("intent helpers", () => {
  it("recognises only the three real intents", () => {
    expect(isEnquiryIntent("system-build")).toBe(true);
    expect(isEnquiryIntent("studio-brief")).toBe(true);
    expect(isEnquiryIntent("enterprise-rfq")).toBe(true);
    expect(isEnquiryIntent("admin")).toBe(false);
    expect(isEnquiryIntent(undefined)).toBe(false);
  });

  it("maps both hardware intents to Systems and the brief to Studio", () => {
    expect(INTENT_DIVISION["system-build"]).toBe("systems");
    expect(INTENT_DIVISION["enterprise-rfq"]).toBe("systems");
    expect(INTENT_DIVISION["studio-brief"]).toBe("studio");
  });

  it("keeps the bot threshold low enough for a fast human with autofill", () => {
    expect(MIN_COMPLETION_MS).toBeLessThanOrEqual(3000);
  });
});

describe("field vocabulary is the single source of truth", () => {
  it("exposes every budget value the schema accepts", () => {
    for (const v of BUDGET_VALUES) {
      expect(systemBuildSchema.safeParse({ ...validBuild, budgetRange: v }).success).toBe(true);
    }
  });

  it("exposes every timing value the schema accepts", () => {
    for (const v of TIMING_VALUES) {
      expect(systemBuildSchema.safeParse({ ...validBuild, timing: v }).success).toBe(true);
    }
  });

  it("rejects a value that is not in the shared list", () => {
    expect(
      systemBuildSchema.safeParse({ ...validBuild, budgetRange: "one-million" }).success,
    ).toBe(false);
  });
});
