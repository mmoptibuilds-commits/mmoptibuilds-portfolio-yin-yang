import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type CookieUpdate = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

type CookieAdapter = {
  getAll: () => unknown[];
  setAll: (cookies: CookieUpdate[], headers: Record<string, string>) => void;
};

const mocks = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  cookieAdapter: null as CookieAdapter | null,
  exchangeCodeForSession: vi.fn(),
  verifyOtp: vi.fn(),
  getUser: vi.fn(),
  rpc: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: mocks.createServerClient.mockImplementation(
    (_url: string, _key: string, options: { cookies: CookieAdapter }) => {
      mocks.cookieAdapter = options.cookies;
      return {
        auth: {
          exchangeCodeForSession: mocks.exchangeCodeForSession,
          verifyOtp: mocks.verifyOtp,
          getUser: mocks.getUser,
          signOut: mocks.signOut,
        },
        rpc: mocks.rpc,
      };
    },
  ),
}));

const mutableEnv = process.env as Record<string, string | undefined>;
const originalEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

describe("owner password recovery callback", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mutableEnv.NEXT_PUBLIC_SITE_URL = "https://www.mmoptibuilds.com";
    mutableEnv.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    mutableEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
    mocks.cookieAdapter = null;
    mocks.exchangeCodeForSession.mockResolvedValue({ error: null });
    mocks.verifyOtp.mockResolvedValue({ error: null });
    mocks.getUser.mockResolvedValue({
      data: { user: { id: "owner-user-id", email: "owner@example.com" } },
      error: null,
    });
    mocks.rpc.mockResolvedValue({ data: true, error: null });
    mocks.signOut.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    if (originalEnv.siteUrl === undefined) delete mutableEnv.NEXT_PUBLIC_SITE_URL;
    else mutableEnv.NEXT_PUBLIC_SITE_URL = originalEnv.siteUrl;
    if (originalEnv.supabaseUrl === undefined) delete mutableEnv.NEXT_PUBLIC_SUPABASE_URL;
    else mutableEnv.NEXT_PUBLIC_SUPABASE_URL = originalEnv.supabaseUrl;
    if (originalEnv.publishableKey === undefined) delete mutableEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else mutableEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalEnv.publishableKey;
  });

  it("exchanges a PKCE code, checks owner access, and carries auth cookies to the redirect", async () => {
    mocks.exchangeCodeForSession.mockImplementation(async () => {
      mocks.cookieAdapter?.setAll(
        [{ name: "sb-owner-session", value: "session-cookie", options: { path: "/", httpOnly: true } }],
        { "Cache-Control": "private, no-store" },
      );
      return { error: null };
    });

    const { NextRequest } = await import("next/server");
    const { GET } = await import("@/app/admin/auth/confirm/route");
    const response = await GET(
      new NextRequest("https://www.mmoptibuilds.com/admin/auth/confirm?code=one-time-code"),
    );

    expect(mocks.exchangeCodeForSession).toHaveBeenCalledWith("one-time-code");
    expect(mocks.rpc).toHaveBeenCalledWith("is_owner");
    expect(response.headers.get("location")).toBe(
      "https://www.mmoptibuilds.com/admin/reset-password",
    );
    expect(response.cookies.get("sb-owner-session")?.value).toBe("session-cookie");
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("accepts Supabase recovery token hashes only for the recovery flow", async () => {
    const { NextRequest } = await import("next/server");
    const { GET } = await import("@/app/admin/auth/confirm/route");
    const response = await GET(
      new NextRequest(
        "https://www.mmoptibuilds.com/admin/auth/confirm?token_hash=one-time-hash&type=recovery",
      ),
    );

    expect(mocks.verifyOtp).toHaveBeenCalledWith({
      token_hash: "one-time-hash",
      type: "recovery",
    });
    expect(response.headers.get("location")).toBe(
      "https://www.mmoptibuilds.com/admin/reset-password",
    );
  });

  it("signs out a valid Supabase account that is not on the owner allowlist", async () => {
    mocks.rpc.mockResolvedValue({ data: false, error: null });

    const { NextRequest } = await import("next/server");
    const { GET } = await import("@/app/admin/auth/confirm/route");
    const response = await GET(
      new NextRequest("https://www.mmoptibuilds.com/admin/auth/confirm?code=one-time-code"),
    );

    expect(mocks.signOut).toHaveBeenCalledOnce();
    expect(response.headers.get("location")).toBe(
      "https://www.mmoptibuilds.com/admin?auth=not-owner",
    );
  });

  it("sends missing or invalid links back to password recovery instructions", async () => {
    const { NextRequest } = await import("next/server");
    const { GET } = await import("@/app/admin/auth/confirm/route");
    const response = await GET(
      new NextRequest("https://www.mmoptibuilds.com/admin/auth/confirm"),
    );

    expect(response.headers.get("location")).toBe(
      "https://www.mmoptibuilds.com/admin/forgot-password?reset=invalid",
    );
    expect(mocks.createServerClient).not.toHaveBeenCalled();
  });
});
