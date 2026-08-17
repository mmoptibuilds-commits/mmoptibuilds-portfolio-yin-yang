import { z } from "zod";
import { BUDGET_VALUES, TIMING_VALUES } from "./enquiry-fields";

/**
 * Enquiry schemas — the single source of truth for all three intake forms.
 *
 * The same schema object validates on the client (for inline messages) and on
 * the server (for actual trust). Client validation is a convenience; the
 * server never trusts it, per spec 13.
 *
 * Values, labels and intent mapping live in enquiry-fields.ts, which has no
 * Zod dependency — the Client Component forms import from there so the
 * validation library never reaches the browser. The enums below are built from
 * those same arrays, so there is one source of truth.
 *
 * Field choices follow spec 13 exactly. Notably:
 *   - Budget is a RANGE, never a number, and "not-decided" is always valid.
 *   - No account, no password, no email verification at launch.
 *   - Phone is optional everywhere. Only email is required for a reply.
 */


const email = z
  .string()
  .trim()
  .min(1, "An email address is needed, or there is no way to reply.")
  .max(254, "That is longer than an email address can be.")
  // Deliberately permissive. Over-strict email regexes reject real addresses.
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "That does not look like an email address — check for a typo.",
  })
  .transform((v) => v.toLowerCase());

const name = z
  .string()
  .trim()
  .min(1, "A name to address the reply to.")
  .max(120, "Please use a shorter name.");

const optionalText = (max: number) =>
  z.string().trim().max(max, `Please keep this under ${max} characters.`).optional().or(z.literal(""));

const budgetRange = z.enum(BUDGET_VALUES, {
  message: "Pick a range, or say it is not decided.",
});

const timing = z.enum(TIMING_VALUES, {
  message: "Roughly when would you want this?",
});

/**
 * Anti-abuse fields, present on every form.
 *
 * `botField` is a honeypot: hidden from humans, so any value means a bot.
 * `renderedAt` supports a minimum-completion-time check — a form submitted
 * in under a couple of seconds was not typed by a person. Neither punishes
 * a real visitor, unlike a puzzle CAPTCHA (spec 13).
 */
const abuseControls = {
  botField: z.literal("", { message: "Rejected." }).optional().or(z.literal("")),
  // Empty string when JavaScript has not run. Treated as "no timing signal".
  renderedAt: z
    .union([z.literal(""), z.coerce.number().int().nonnegative()])
    .optional(),
  turnstileToken: z.string().optional(),
};

/** Consent is explicit and recorded with its notice version. */
const consent = z.literal(true, {
  message: "Please confirm you are happy to be contacted about this enquiry.",
});

// ── 1. Systems build brief ───────────────────────────────────────────────────

export const systemBuildSchema = z.object({
  intent: z.literal("system-build"),
  name,
  email,
  phone: optionalText(32),
  useCase: z
    .string()
    .trim()
    .min(1, "What will the machine be doing? A sentence is fine."),
  applications: optionalText(600),
  priorities: optionalText(400),
  existingParts: optionalText(600),
  budgetRange,
  assembly: z.enum(["assembled-tested", "parts-only", "not-sure"], {
    message: "Assembled and tested, parts only, or not sure yet?",
  }),
  deliveryCity: z
    .string()
    .trim()
    .min(1, "Which city? It affects delivery and tax treatment."),
  timing,
  constraints: optionalText(1200),
  consent,
  ...abuseControls,
});

// ── 2. Enterprise RFQ ────────────────────────────────────────────────────────

export const enterpriseRfqSchema = z.object({
  intent: z.literal("enterprise-rfq"),
  name,
  email,
  phone: optionalText(32),
  organisation: z.string().trim().min(1, "Which organisation is this for?"),
  manufacturer: z.string().trim().min(1, "Which manufacturer?"),
  partNumber: z
    .string()
    .trim()
    .min(1, "The exact part number or SKU. This is the specification."),
  quantity: z.coerce
    .number({ message: "How many units?" })
    .int("Whole units only.")
    .min(1, "At least one unit.")
    .max(100000, "For volumes this large, describe it in the notes instead."),
  partialFillAccepted: z.enum(["yes", "no"], {
    message: "Would a partial quantity be useful to you?",
  }),
  condition: z.enum(["new-only", "refurbished-ok", "open-box-ok", "any"], {
    message: "Which conditions are acceptable?",
  }),
  warrantyRequirement: optionalText(400),
  technicalRequirements: optionalText(1200),
  deliveryCity: z.string().trim().min(1, "Delivery city or postcode."),
  requiredDate: optionalText(60),
  taxRequirements: optionalText(400),
  consent,
  ...abuseControls,
});

// ── 3. Studio brief ──────────────────────────────────────────────────────────

export const studioBriefSchema = z.object({
  intent: z.literal("studio-brief"),
  name,
  email,
  phone: optionalText(32),
  organisation: optionalText(200),
  projectType: z.enum(["new-site", "redesign", "startup-launch", "not-sure"], {
    message: "Which of these is closest?",
  }),
  currentUrl: optionalText(400),
  businessGoal: z
    .string()
    .trim()
    .min(1, "What should the site do for the business?"),
  audience: optionalText(600),
  primaryConversion: optionalText(400),
  requiredPages: optionalText(800),
  existingAssets: z.enum(["everything", "some", "nothing", "not-sure"], {
    message: "Roughly what do you already have?",
  }),
  hostingState: z.enum(["own-both", "own-domain", "own-neither", "not-sure"], {
    message: "Who currently holds the domain and hosting?",
  }),
  budgetRange,
  timing,
  decisionMakers: optionalText(300),
  description: optionalText(2000),
  consent,
  ...abuseControls,
});

// ── Union ────────────────────────────────────────────────────────────────────

export const enquirySchema = z.discriminatedUnion("intent", [
  systemBuildSchema,
  enterpriseRfqSchema,
  studioBriefSchema,
]);

export type Enquiry = z.infer<typeof enquirySchema>;
export type SystemBuildEnquiry = z.infer<typeof systemBuildSchema>;
export type EnterpriseRfqEnquiry = z.infer<typeof enterpriseRfqSchema>;
export type StudioBriefEnquiry = z.infer<typeof studioBriefSchema>;

/* Intent helpers, labels and MIN_COMPLETION_MS are re-exported from
   enquiry-fields so existing server-side imports keep working, while Client
   Components import them directly from there and avoid pulling in Zod. */
export {
  ENQUIRY_INTENTS,
  INTENT_DIVISION,
  INTENT_LABELS,
  BUDGET_LABELS,
  TIMING_LABELS,
  MIN_COMPLETION_MS,
  isEnquiryIntent,
} from "./enquiry-fields";
export type { EnquiryIntent } from "./enquiry-fields";
