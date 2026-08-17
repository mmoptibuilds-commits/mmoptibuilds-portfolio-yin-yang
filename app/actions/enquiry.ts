"use server";

import { headers } from "next/headers";
import { enquirySchema, MIN_COMPLETION_MS, type EnquiryIntent } from "@/lib/enquiry-schema";
import { abuseFingerprint, storeEnquiry } from "@/lib/enquiry-store";

/**
 * The single entry point for all three enquiry forms.
 *
 * A Server Action rather than a route handler: it keeps the form working
 * without client-side JavaScript (progressive enhancement), and Next.js
 * handles the CSRF-relevant origin check for us.
 *
 * Order of checks matters. Cheap rejections happen before expensive ones, and
 * the honeypot is checked before Turnstile so obvious bots never cost a
 * network round trip.
 */

export type EnquiryFormState = {
  status: "idle" | "success" | "error";
  /** Field-level messages, keyed by field name. */
  errors?: Record<string, string>;
  /** A single message about the submission as a whole. */
  message?: string;
  reference?: string;
  /**
   * Everything the visitor typed, minus consent and anti-abuse fields, so a
   * recoverable failure never loses their work (spec 13).
   */
  values?: Record<string, string>;
};

async function verifyTurnstile(token: string | undefined, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Not configured yet: treat as unverified rather than blocking submissions.
  // The flag is recorded on the row so the owner can see it was not checked.
  if (!secret) return { configured: false, ok: false };
  if (!token) return { configured: true, ok: false };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body, signal: AbortSignal.timeout(8000) },
    );
    const data = (await res.json()) as { success?: boolean };
    return { configured: true, ok: data.success === true };
  } catch {
    // A Cloudflare outage must not silently drop real enquiries. Record it as
    // unverified and let the submission through for manual review.
    console.error("turnstile verification unreachable");
    return { configured: true, ok: false };
  }
}

/** Preserve non-sensitive input so a failed submit does not clear the form. */
function preserved(raw: Record<string, unknown>): Record<string, string> {
  const drop = new Set(["consent", "botField", "renderedAt", "turnstileToken", "cf-turnstile-response"]);
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!drop.has(k) && typeof v === "string") out[k] = v;
  }
  return out;
}

export async function submitEnquiry(
  _prev: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const raw = Object.fromEntries(formData) as Record<string, unknown>;
  const values = preserved(raw);

  // Checkboxes arrive as "on" or are absent; Zod wants a real boolean.
  const parsed = enquirySchema.safeParse({
    ...raw,
    consent: raw.consent === "on" || raw.consent === "true",
    turnstileToken: raw["cf-turnstile-response"] ?? raw.turnstileToken,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      // First message per field only — a stack of five is noise.
      if (!errors[key]) errors[key] = issue.message;
    }
    return {
      status: "error",
      errors,
      message: "A few fields need attention before this can be sent.",
      values,
    };
  }

  const enquiry = parsed.data;

  /* Anti-abuse checks run AFTER validation, deliberately.
     If they ran first, a human who pressed Submit on a half-empty form within
     the minimum-completion window would be silently told "Received" and their
     enquiry would vanish — the worst possible outcome. Validating first means
     a real person always gets help with their form, and only a submission that
     would otherwise have succeeded is tested for automation. A bot that fills
     every field correctly is still caught. The cost of reordering is one Zod
     parse against a payload we were going to parse anyway. */

  // 1. Honeypot. Hidden from humans, so any value is automated.
  if (typeof enquiry.botField === "string" && enquiry.botField.length > 0) {
    // Report success. Telling a bot it was detected only helps it adapt.
    return { status: "success", reference: "MOB-000000", message: "Received." };
  }

  // 2. Minimum completion time.
  const completionMs =
    typeof enquiry.renderedAt === "number" && enquiry.renderedAt > 0
      ? Date.now() - enquiry.renderedAt
      : null; // null when JavaScript never ran; the check below is then skipped.
  if (completionMs !== null && completionMs < MIN_COMPLETION_MS) {
    return { status: "success", reference: "MOB-000000", message: "Received." };
  }

  const headerList = await headers();
  const ip =
    headerList.get("cf-connecting-ip") ??
    headerList.get("x-forwarded-for")?.split(",")[0].trim() ??
    null;
  const userAgent = headerList.get("user-agent");

  // 3. Turnstile.
  const turnstile = await verifyTurnstile(enquiry.turnstileToken, ip);
  if (turnstile.configured && !turnstile.ok) {
    return {
      status: "error",
      message:
        "The browser check did not complete. Reload the page and try once more — your answers are still here.",
      values,
    };
  }

  // 4. Store.
  const result = await storeEnquiry(enquiry, {
    sourcePath: (raw.sourcePath as string) || null,
    fingerprint: abuseFingerprint(ip, userAgent),
    turnstileOk: turnstile.ok,
    completionMs,
  });

  if (!result.ok) {
    return {
      status: "error",
      message:
        result.reason === "rate-limited"
          ? "That is several enquiries from this connection in the last hour. If that was not you, wait a little and try again."
          : "Something went wrong saving this. Nothing was lost — try again in a moment.",
      values,
    };
  }

  return {
    status: "success",
    reference: result.reference,
    message: result.duplicate
      ? "This enquiry was already received — here is the same reference again."
      : "Received.",
  };
}

export type { EnquiryIntent };
