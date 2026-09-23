import { site } from "@/lib/site";

export const OWNER_RECOVERY_CALLBACK_PATH = "/admin/auth/confirm";

/**
 * Resolve auth links against the configured canonical site origin. This keeps
 * recovery emails on the real domain while allowing local development to use
 * its own NEXT_PUBLIC_SITE_URL.
 */
export function getSiteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || site.url;
  return new URL(path, baseUrl).toString();
}

export function getOwnerRecoveryCallbackUrl(): string {
  return getSiteUrl(OWNER_RECOVERY_CALLBACK_PATH);
}
