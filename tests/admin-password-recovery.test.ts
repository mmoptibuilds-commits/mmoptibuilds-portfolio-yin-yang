import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getOwnerSession: vi.fn(),
  getSupabaseServerClient: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  updateUser: vi.fn(),
  updateEnquiry: vi.fn(),
}));

vi.mock("@/lib/owner-auth", () => ({
  DEV_SESSION_COOKIE: "mob_dev_owner",
  authMode: "supabase",
  getOwnerSession: mocks.getOwnerSession,
  getSupabaseServerClient: mocks.getSupabaseServerClient,
}));

vi.mock("@/lib/enquiry-store", () => ({ updateEnquiry: mocks.updateEnquiry }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("owner password recovery actions", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.mmoptibuilds.com";
    mocks.resetPasswordForEmail.mockResolvedValue({ error: null });
    mocks.updateUser.mockResolvedValue({ error: null });
    mocks.getOwnerSession.mockResolvedValue({
      email: "owner@example.com",
      mode: "supabase",
    });
    mocks.getSupabaseServerClient.mockResolvedValue({
      auth: {
        resetPasswordForEmail: mocks.resetPasswordForEmail,
        updateUser: mocks.updateUser,
      },
    });
  });

  it("sends a neutral recovery response and uses the canonical confirmation URL", async () => {
    const { requestPasswordReset } = await import("@/app/admin/actions");

    const result = await requestPasswordReset({}, form({ email: " owner@example.com " }));

    expect(mocks.resetPasswordForEmail).toHaveBeenCalledWith("owner@example.com", {
      redirectTo: "https://www.mmoptibuilds.com/admin/auth/confirm",
    });
    expect(result).toEqual({ sent: true });
  });

  it("rejects a mismatched new password without updating Supabase", async () => {
    const { setOwnerPassword } = await import("@/app/admin/actions");

    const result = await setOwnerPassword(
      {},
      form({ password: "a-secure-new-password", confirmPassword: "different-password" }),
    );

    expect(result).toEqual({ error: "The passwords do not match." });
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("does not allow a session without owner membership to change the password", async () => {
    mocks.getOwnerSession.mockResolvedValue(null);
    const { setOwnerPassword } = await import("@/app/admin/actions");

    const result = await setOwnerPassword(
      {},
      form({ password: "a-secure-new-password", confirmPassword: "a-secure-new-password" }),
    );

    expect(result).toEqual({ error: "This reset link is invalid or expired. Request a new one." });
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("does not send an email address back in provider failure messages", async () => {
    mocks.resetPasswordForEmail.mockResolvedValue({ error: new Error("SMTP unavailable") });
    const { requestPasswordReset } = await import("@/app/admin/actions");

    const result = await requestPasswordReset({}, form({ email: "owner@example.com" }));

    expect(result).toEqual({
      error: "We couldn’t start password recovery. Check the Supabase email and redirect settings, then try again.",
    });
    expect(JSON.stringify(result)).not.toContain("owner@example.com");
  });

  it("updates a password only for an authenticated owner and returns to the console", async () => {
    const { setOwnerPassword } = await import("@/app/admin/actions");

    await expect(
      setOwnerPassword(
        {},
        form({
          password: "a-secure-new-password",
          confirmPassword: "a-secure-new-password",
        }),
      ),
    ).rejects.toThrow("REDIRECT:/admin");

    expect(mocks.updateUser).toHaveBeenCalledWith({ password: "a-secure-new-password" });
  });
});
