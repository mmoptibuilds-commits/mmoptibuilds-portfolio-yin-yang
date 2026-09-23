import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresh the owner session before the admin Server Components render.
 * Server Components can read cookies but cannot reliably write refreshed
 * cookies, so the Proxy carries both cookie updates and cache headers through.
 */
export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Local development can use the password-only mode. Production remains
  // locked by owner-auth.ts whenever Supabase is not configured.
  if (!supabaseUrl || !publishableKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([name, value]) =>
          supabaseResponse.headers.set(name, value),
        );
      },
    },
  });

  // Verifies the JWT and refreshes an expired token when possible. The owner
  // allowlist check still runs separately in getOwnerSession().
  await supabase.auth.getClaims();

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
