"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DEV_SESSION_COOKIE,
  authMode,
  getOwnerSession,
  getSupabaseServerClient,
} from "@/lib/owner-auth";
import { updateEnquiry } from "@/lib/enquiry-store";

export type SignInState = { error?: string };

/**
 * Owner sign-in.
 *
 * Error messages are deliberately identical for "no such user" and "wrong
 * password" — distinguishing them tells an attacker which addresses exist.
 */
export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!password) return { error: "Enter a password." };

  if (authMode === "locked") {
    return {
      error:
        "Owner access is not configured on this deployment. Set the Supabase environment variables first.",
    };
  }

  if (authMode === "dev") {
    if (password !== process.env.ADMIN_DEV_PASSWORD) {
      return { error: "Those details were not accepted." };
    }
    const cookieStore = await cookies();
    cookieStore.set(DEV_SESSION_COOKIE, password, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/admin",
      maxAge: 60 * 60 * 8,
    });
    redirect("/admin");
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Those details were not accepted." };

  // Signing in is not enough — the account must be on the owner allowlist.
  const session = await getOwnerSession();
  if (!session) {
    await supabase.auth.signOut();
    return { error: "That account is not an owner account." };
  }

  redirect("/admin");
}

export async function signOut() {
  if (authMode === "supabase") {
    const supabase = await getSupabaseServerClient();
    await supabase.auth.signOut();
  } else {
    const cookieStore = await cookies();
    cookieStore.delete({ name: DEV_SESSION_COOKIE, path: "/admin" });
  }
  redirect("/admin");
}

export type TriageState = { ok?: boolean; error?: string };

/**
 * Triage an enquiry. Only the owner working columns are writable — the
 * database trigger rejects any attempt to alter submitted content, so this
 * action cannot rewrite what a visitor actually said even if it tried.
 */
export async function triageEnquiry(
  _prev: TriageState,
  formData: FormData,
): Promise<TriageState> {
  const session = await getOwnerSession();
  if (!session) return { error: "Not signed in." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing enquiry id." };

  const rawQuote = String(formData.get("quote_amount") ?? "").trim();
  const rawFollowUp = String(formData.get("follow_up_on") ?? "").trim();

  const result = await updateEnquiry(id, {
    status: String(formData.get("status") ?? "new"),
    priority: String(formData.get("priority") ?? "normal"),
    owner_notes: String(formData.get("owner_notes") ?? ""),
    quote_amount: rawQuote ? Number(rawQuote) : null,
    follow_up_on: rawFollowUp || null,
  });

  if (!result.ok) return { error: result.message };
  return { ok: true };
}
