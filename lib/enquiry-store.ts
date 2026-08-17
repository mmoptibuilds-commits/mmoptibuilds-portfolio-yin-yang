import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import type { Enquiry } from "./enquiry-schema";
import { INTENT_DIVISION } from "./enquiry-fields";
import { CONSENT_VERSION } from "./site";

/**
 * Enquiry storage.
 *
 * Two backends behind one interface:
 *
 *   Supabase  — used whenever SUPABASE_URL and SUPABASE_SECRET_KEY are set.
 *   File      — used otherwise, writing to .enquiries/ in the project root.
 *
 * The file backend is not a stub. It validates, deduplicates, rate-limits and
 * issues real reference IDs, so the whole conversion path is genuinely
 * testable before any account exists. Adding credentials switches backend
 * with no code change.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;

export const storageBackend: "supabase" | "file" =
  SUPABASE_URL && SUPABASE_SECRET ? "supabase" : "file";

/* ── Reference IDs ──────────────────────────────────────────────────────────
   Format: MOB-<intent letter><yyMM>-<6 chars>. Short enough to read down a
   phone line, and no ambiguous characters (no O/0, I/1). */

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function referenceFor(intent: Enquiry["intent"], now: Date) {
  const letter = intent === "system-build" ? "B" : intent === "enterprise-rfq" ? "E" : "S";
  const stamp =
    String(now.getUTCFullYear()).slice(2) +
    String(now.getUTCMonth() + 1).padStart(2, "0");
  const bytes = randomBytes(6);
  let tail = "";
  for (let i = 0; i < 6; i += 1) tail += ALPHABET[bytes[i] % ALPHABET.length];
  return `MOB-${letter}${stamp}-${tail}`;
}

/**
 * Salted fingerprint for rate limiting. A raw IP is a personal identifier and
 * is deliberately never stored (spec 14); a salted hash supports throttling
 * without retaining one.
 */
export function abuseFingerprint(ip: string | null, userAgent: string | null) {
  const salt = process.env.ABUSE_FINGERPRINT_SALT ?? "mmoptibuilds-dev-salt";
  return createHash("sha256")
    .update(`${salt}|${ip ?? "unknown"}|${userAgent ?? "unknown"}`)
    .digest("hex")
    .slice(0, 32);
}

/** Idempotency key. A double-tapped submit produces the same hash. */
export function submissionHash(enquiry: Enquiry) {
  const { botField: _b, renderedAt: _r, turnstileToken: _t, ...meaningful } = enquiry;
  return createHash("sha256")
    .update(JSON.stringify(meaningful, Object.keys(meaningful).sort()))
    .digest("hex");
}

export type StoreResult =
  | { ok: true; reference: string; duplicate: boolean }
  | { ok: false; reason: "rate-limited" | "storage-failed" };

type StoredRow = {
  id: string;
  reference: string;
  intent: Enquiry["intent"];
  division: "systems" | "studio";
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  payload: Record<string, unknown>;
  source_path: string | null;
  consent_version: string;
  abuse_fingerprint: string;
  turnstile_ok: boolean;
  completion_ms: number | null;
  submission_hash: string;
  created_at: string;
  status: string;
  priority: string;
  owner_notes: string | null;
  quote_amount: number | null;
  follow_up_on: string | null;
};

function toRow(
  enquiry: Enquiry,
  meta: { sourcePath: string | null; fingerprint: string; turnstileOk: boolean; completionMs: number | null },
  now: Date,
) {
  const {
    intent, name, email, phone,
    botField: _b, renderedAt: _r, turnstileToken: _t, consent: _c,
    ...payload
  } = enquiry as Enquiry & Record<string, unknown>;

  return {
    reference: referenceFor(intent, now),
    intent,
    division: INTENT_DIVISION[intent],
    contact_name: name,
    contact_email: email,
    contact_phone: (phone as string) || null,
    payload,
    source_path: meta.sourcePath,
    consent_version: CONSENT_VERSION,
    abuse_fingerprint: meta.fingerprint,
    turnstile_ok: meta.turnstileOk,
    completion_ms: meta.completionMs,
    submission_hash: submissionHash(enquiry),
  };
}

const RATE_LIMIT_PER_HOUR = 5;

/* ── File backend ───────────────────────────────────────────────────────── */

const FILE_DIR = path.join(process.cwd(), ".enquiries");
const FILE_PATH = path.join(FILE_DIR, "enquiries.json");

async function readFileStore(): Promise<StoredRow[]> {
  try {
    return JSON.parse(await readFile(FILE_PATH, "utf8")) as StoredRow[];
  } catch {
    return [];
  }
}

async function writeFileStore(rows: StoredRow[]) {
  await mkdir(FILE_DIR, { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify(rows, null, 2), "utf8");
}

/* ── Public API ─────────────────────────────────────────────────────────── */

export async function storeEnquiry(
  enquiry: Enquiry,
  meta: {
    sourcePath: string | null;
    fingerprint: string;
    turnstileOk: boolean;
    completionMs: number | null;
  },
): Promise<StoreResult> {
  const now = new Date();
  const row = toRow(enquiry, meta, now);

  if (storageBackend === "supabase") {
    const client = createClient(SUPABASE_URL!, SUPABASE_SECRET!, {
      auth: { persistSession: false },
    });

    const { data: recent, error: rateError } = await client.rpc("recent_submission_count", {
      fingerprint: meta.fingerprint,
      window_minutes: 60,
    });
    if (!rateError && typeof recent === "number" && recent >= RATE_LIMIT_PER_HOUR) {
      return { ok: false, reason: "rate-limited" };
    }

    const { data, error } = await client
      .from("enquiries")
      .insert(row)
      .select("reference")
      .single();

    if (error) {
      // 23505 is unique_violation: the same submission arrived twice. Return
      // the original reference so a double tap looks like one submission.
      if (error.code === "23505") {
        const { data: existing } = await client
          .from("enquiries")
          .select("reference")
          .eq("submission_hash", row.submission_hash)
          .single();
        if (existing?.reference) {
          return { ok: true, reference: existing.reference, duplicate: true };
        }
      }
      console.error("enquiry insert failed", { code: error.code });
      return { ok: false, reason: "storage-failed" };
    }

    return { ok: true, reference: data.reference, duplicate: false };
  }

  // File backend.
  try {
    const rows = await readFileStore();

    const duplicate = rows.find((r) => r.submission_hash === row.submission_hash);
    if (duplicate) {
      return { ok: true, reference: duplicate.reference, duplicate: true };
    }

    const cutoff = Date.now() - 60 * 60 * 1000;
    const recentCount = rows.filter(
      (r) => r.abuse_fingerprint === meta.fingerprint && Date.parse(r.created_at) > cutoff,
    ).length;
    if (recentCount >= RATE_LIMIT_PER_HOUR) {
      return { ok: false, reason: "rate-limited" };
    }

    rows.push({
      ...row,
      id: randomBytes(16).toString("hex"),
      created_at: now.toISOString(),
      status: "new",
      priority: "normal",
      owner_notes: null,
      quote_amount: null,
      follow_up_on: null,
    } as StoredRow);

    await writeFileStore(rows);
    return { ok: true, reference: row.reference, duplicate: false };
  } catch (error) {
    console.error("enquiry file write failed", error);
    return { ok: false, reason: "storage-failed" };
  }
}

/** Dashboard read. Newest first. */
export async function listEnquiries(): Promise<StoredRow[]> {
  if (storageBackend === "supabase") {
    const client = createClient(SUPABASE_URL!, SUPABASE_SECRET!, {
      auth: { persistSession: false },
    });
    const { data, error } = await client
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error("enquiry list failed", { code: error.code });
      return [];
    }
    return (data ?? []) as StoredRow[];
  }

  const rows = await readFileStore();
  return rows.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

/**
 * Update the owner working columns only.
 *
 * The allowed keys are enumerated here as well as enforced by the database
 * trigger. Belt and braces on purpose: the trigger is the real guarantee, but
 * a typo'd column name should fail here rather than produce a confusing
 * Postgres exception.
 */
const WRITABLE_COLUMNS = [
  "status",
  "priority",
  "owner_notes",
  "quote_amount",
  "follow_up_on",
] as const;

type WritableColumn = (typeof WRITABLE_COLUMNS)[number];

const VALID_STATUS = new Set([
  "new", "reviewing", "quoted", "won", "lost", "spam", "duplicate", "archived",
]);
const VALID_PRIORITY = new Set(["low", "normal", "high"]);

export async function updateEnquiry(
  id: string,
  patch: Record<string, unknown>,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const update: Record<string, unknown> = {};
  for (const key of WRITABLE_COLUMNS) {
    if (key in patch) update[key] = patch[key as WritableColumn];
  }

  if (typeof update.status === "string" && !VALID_STATUS.has(update.status)) {
    return { ok: false, message: "That is not a valid status." };
  }
  if (typeof update.priority === "string" && !VALID_PRIORITY.has(update.priority)) {
    return { ok: false, message: "That is not a valid priority." };
  }
  if (update.quote_amount !== null && update.quote_amount !== undefined) {
    const n = Number(update.quote_amount);
    if (!Number.isFinite(n) || n < 0) {
      return { ok: false, message: "The quote amount must be a positive number." };
    }
    update.quote_amount = n;
  }
  if (update.owner_notes === "") update.owner_notes = null;

  if (Object.keys(update).length === 0) return { ok: true };

  if (storageBackend === "supabase") {
    const client = createClient(SUPABASE_URL!, SUPABASE_SECRET!, {
      auth: { persistSession: false },
    });
    const { error } = await client.from("enquiries").update(update).eq("id", id);
    if (error) {
      console.error("enquiry update failed", { code: error.code });
      return { ok: false, message: "That change could not be saved." };
    }
    return { ok: true };
  }

  try {
    const rows = await readFileStore();
    const row = rows.find((r) => r.id === id);
    if (!row) return { ok: false, message: "No enquiry with that id." };
    Object.assign(row, update);
    await writeFileStore(rows);
    return { ok: true };
  } catch (error) {
    console.error("enquiry update write failed", error);
    return { ok: false, message: "That change could not be saved." };
  }
}

export type { StoredRow };
