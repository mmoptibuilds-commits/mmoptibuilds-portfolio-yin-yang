import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/auth-recovery";

export const dynamic = "force-dynamic";

function redirectResponse(path: string) {
  const response = NextResponse.redirect(new URL(getSiteUrl(path)));
  response.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

function changeDestination(response: NextResponse, path: string) {
  response.headers.set("Location", getSiteUrl(path));
  return response;
}

/**
 * Exchange a Supabase password recovery link for an owner session. Supports
 * the default PKCE `code` link and Supabase's token-hash recovery template.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const hasValidTokenHash = Boolean(tokenHash && type === "recovery");
  const target = redirectResponse("/admin/reset-password");

  if (!code && !hasValidTokenHash) {
    return changeDestination(target, "/admin/forgot-password?reset=invalid");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    return changeDestination(target, "/admin/forgot-password?reset=unavailable");
  }

  try {
    const supabase = createServerClient(supabaseUrl, publishableKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            target.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([name, value]) => target.headers.set(name, value));
        },
      },
    });

    const { error: verificationError } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({
          token_hash: tokenHash!,
          type: "recovery",
        });

    if (verificationError) {
      return changeDestination(target, "/admin/forgot-password?reset=invalid");
    }

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data.user) {
      return changeDestination(target, "/admin/forgot-password?reset=invalid");
    }

    const { data: isOwner, error: ownerError } = await supabase.rpc("is_owner");
    if (ownerError || isOwner !== true) {
      await supabase.auth.signOut();
      return changeDestination(target, "/admin?auth=not-owner");
    }

    return target;
  } catch {
    return changeDestination(target, "/admin/forgot-password?reset=invalid");
  }
}
