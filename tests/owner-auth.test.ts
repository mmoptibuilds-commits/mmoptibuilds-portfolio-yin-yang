import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  rpc: vi.fn(),
  from: vi.fn(),
  client: {} as {
    auth: { getUser: typeof vi.fn };
    rpc: typeof vi.fn;
    from: typeof vi.fn;
  },
}));

vi.mock("server-only", () => ({}));
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => mocks.client),
}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ getAll: () => [], set: vi.fn() })),
}));

const originalEnv = {
  NODE_ENV: process.env.NODE_ENV,
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  devPassword: process.env.ADMIN_DEV_PASSWORD,
};
const mutableEnv = process.env as Record<string, string | undefined>;

describe("Supabase owner authorization", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    mutableEnv.NODE_ENV = "test";
    mutableEnv.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    mutableEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
    delete mutableEnv.ADMIN_DEV_PASSWORD;

    mocks.getUser.mockResolvedValue({
      data: { user: { id: "owner-user-id", email: "owner@example.com" } },
      error: null,
    });
    mocks.rpc.mockResolvedValue({ data: true, error: null });
    mocks.from.mockReturnValue({
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
      }),
    });
    mocks.client = { auth: { getUser: mocks.getUser }, rpc: mocks.rpc, from: mocks.from };
  });

  afterEach(() => {
    if (originalEnv.NODE_ENV === undefined) delete mutableEnv.NODE_ENV;
    else mutableEnv.NODE_ENV = originalEnv.NODE_ENV;
    if (originalEnv.url === undefined) delete mutableEnv.NEXT_PUBLIC_SUPABASE_URL;
    else mutableEnv.NEXT_PUBLIC_SUPABASE_URL = originalEnv.url;
    if (originalEnv.key === undefined) delete mutableEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else mutableEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalEnv.key;
    if (originalEnv.devPassword === undefined) delete mutableEnv.ADMIN_DEV_PASSWORD;
    else mutableEnv.ADMIN_DEV_PASSWORD = originalEnv.devPassword;
  });

  it("authorizes an allowlisted user through the RLS-safe is_owner RPC", async () => {
    const { getOwnerSession } = await import("@/lib/owner-auth");

    await expect(getOwnerSession()).resolves.toEqual({
      email: "owner@example.com",
      mode: "supabase",
    });
    expect(mocks.rpc).toHaveBeenCalledWith("is_owner");
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("denies a signed-in user who is not on the owner allowlist", async () => {
    mocks.rpc.mockResolvedValue({ data: false, error: null });
    const { getOwnerSession } = await import("@/lib/owner-auth");

    await expect(getOwnerSession()).resolves.toBeNull();
  });

  it("fails closed when the ownership check errors", async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: new Error("RPC failed") });
    const { getOwnerSession } = await import("@/lib/owner-auth");

    await expect(getOwnerSession()).resolves.toBeNull();
  });
});
