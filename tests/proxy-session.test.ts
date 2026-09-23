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
  getClaims: vi.fn(),
  cookieAdapter: null as CookieAdapter | null,
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(
    (
      _url: string,
      _key: string,
      options: { cookies: CookieAdapter },
    ) => {
      mocks.cookieAdapter = options.cookies;
      return { auth: { getClaims: mocks.getClaims } };
    },
  ),
}));

const originalEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

describe("Supabase session proxy", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
    mocks.cookieAdapter = null;
    mocks.getClaims.mockResolvedValue({ data: { claims: null }, error: null });
  });

  afterEach(() => {
    if (originalEnv.url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv.url;
    if (originalEnv.key === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalEnv.key;
  });

  it("refreshes sessions and carries Supabase cookies and cache headers to the response", async () => {
    mocks.getClaims.mockImplementation(async () => {
      mocks.cookieAdapter?.setAll(
        [{ name: "sb-refresh", value: "refreshed", options: { path: "/", httpOnly: true } }],
        { "Cache-Control": "private, no-store" },
      );
      return { data: { claims: { sub: "owner-user-id" } }, error: null };
    });

    const { NextRequest } = await import("next/server");
    const { proxy } = await import("@/proxy");
    const request = new NextRequest("https://www.mmoptibuilds.com/admin");
    const response = await proxy(request);

    expect(mocks.getClaims).toHaveBeenCalledOnce();
    expect(response.cookies.get("sb-refresh")?.value).toBe("refreshed");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
});
