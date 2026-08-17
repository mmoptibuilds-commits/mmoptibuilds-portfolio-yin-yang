/**
 * Enquiry field vocabulary: values, labels and intent mapping.
 *
 * Deliberately free of any Zod import. The three forms are Client Components
 * and need these labels to render, so anything this module pulls in ships to
 * the browser. When the labels lived in enquiry-schema.ts, importing them
 * dragged the whole validation library into the client bundle and put
 * /contact 64KB over the JS budget — for two lookup tables.
 *
 * lib/enquiry-schema.ts builds its Zod enums from the value arrays here, so
 * there is still exactly one source of truth.
 */

export const BUDGET_VALUES = [
  "not-decided",
  "under-50k",
  "50k-100k",
  "100k-200k",
  "200k-500k",
  "over-500k",
] as const;

export type BudgetRange = (typeof BUDGET_VALUES)[number];

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  "not-decided": "Not decided yet",
  "under-50k": "Under ₹50,000",
  "50k-100k": "₹50,000 – ₹1,00,000",
  "100k-200k": "₹1,00,000 – ₹2,00,000",
  "200k-500k": "₹2,00,000 – ₹5,00,000",
  "over-500k": "Over ₹5,00,000",
};

export const TIMING_VALUES = [
  "exploring",
  "1-month",
  "1-3-months",
  "3-plus-months",
] as const;

export type Timing = (typeof TIMING_VALUES)[number];

export const TIMING_LABELS: Record<Timing, string> = {
  exploring: "Just exploring",
  "1-month": "Within a month",
  "1-3-months": "One to three months",
  "3-plus-months": "Three months or more",
};

export const ENQUIRY_INTENTS = [
  "system-build",
  "enterprise-rfq",
  "studio-brief",
] as const;

export type EnquiryIntent = (typeof ENQUIRY_INTENTS)[number];

export const INTENT_LABELS: Record<EnquiryIntent, string> = {
  "system-build": "System build",
  "enterprise-rfq": "Enterprise RFQ",
  "studio-brief": "Studio brief",
};

/** Which division each intent belongs to, for routing and dashboard filters. */
export const INTENT_DIVISION: Record<EnquiryIntent, "systems" | "studio"> = {
  "system-build": "systems",
  "enterprise-rfq": "systems",
  "studio-brief": "studio",
};

export function isEnquiryIntent(value: unknown): value is EnquiryIntent {
  return (
    typeof value === "string" && (ENQUIRY_INTENTS as readonly string[]).includes(value)
  );
}

/**
 * Minimum time a human plausibly needs to complete a form, in milliseconds.
 * Anything faster is treated as automated. Kept low enough that a fast typist
 * using autofill is never rejected.
 */
export const MIN_COMPLETION_MS = 2500;
