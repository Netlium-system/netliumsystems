import { headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

export type SecurityEventType =
  | "login"
  | "logout"
  | "signup"
  | "password_updated"
  | "mfa_enrolled"
  | "mfa_unenrolled"
  | "sessions_revoked";

/**
 * Logs a real security event against the authenticated caller's own row —
 * always called with the request-scoped, RLS-respecting server client, never
 * the admin client, since a user recording their own login history is
 * exactly what `login_history_select_own`/`insert_own` policies are for.
 */
export async function recordSecurityEvent(
  supabase: SupabaseClient,
  userId: string,
  eventType: SecurityEventType
): Promise<void> {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent");

  await supabase.from("login_history").insert({
    user_id: userId,
    event_type: eventType,
    user_agent: userAgent
  });
}
