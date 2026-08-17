import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Owner authentication.
 *
 * Two modes, matching the storage layer:
 *
 *   Supabase configured — real Supabase Auth. The signed-in user must also
 *     appear in the `owner_accounts` table; membership there is what grants
 *     access, and it can only be written with the service role. A JWT claim
 *     would be the wrong check, because claims are set at sign-up.
 *
 *   Not configured — a local development mode gated on ADMIN_DEV_PASSWORD.
 *     It only activates when NODE_ENV !== "production", so a deployment that
 *     forgets to configure Supabase gets a locked door rather than an open
 *     one. This is the important half of the design: the insecure path must be
 *     impossible in production, not merely discouraged.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const authMode: "supabase" | "dev" | "locked" = SUPABASE_URL && SUPABASE_PUBLISHABLE
  ? "supabase"
  : process.env.NODE_ENV !== "production" && process.env.ADMIN_DEV_PASSWORD
    ? "dev"
    : "locked";

export const DEV_SESSION_COOKIE = "mob_dev_owner";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL!, SUPABASE_PUBLISHABLE!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render, where cookies are readonly.
          // Middleware refreshes the session instead; ignoring here is correct.
        }
      },
    },
  });
}

export type OwnerSession = { email: string; mode: typeof authMode };

/**
 * Returns the owner session, or null. Never throws — callers redirect on null.
 */
export async function getOwnerSession(): Promise<OwnerSession | null> {
  if (authMode === "locked") return null;

  if (authMode === "dev") {
    const cookieStore = await cookies();
    const token = cookieStore.get(DEV_SESSION_COOKIE)?.value;
    if (!token) return null;
    // Compared against the configured password rather than a signed token:
    // this path is development-only and never reachable in production.
    if (token !== process.env.ADMIN_DEV_PASSWORD) return null;
    return { email: "owner@localhost", mode: "dev" };
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  // Signed in is not the same as being the owner.
  const { data: owner } = await supabase
    .from("owner_accounts")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!owner) return null;
  return { email: data.user.email ?? "owner", mode: "supabase" };
}
