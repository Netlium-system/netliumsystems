import { cookies, headers } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEVICE_COOKIE_NAME = "nlm_device_id";
const DEVICE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Recognizes the current browser as a device tied to this account. Not an
 * explicit "trust this device" opt-in flow — every successful sign-in
 * records/refreshes a row here, which is what backs the Settings > Security
 * device list. The cookie only carries an opaque id, never anything
 * sensitive.
 */
export async function recordTrustedDevice(supabase: SupabaseClient, userId: string): Promise<void> {
  const cookieStore = await cookies();
  let deviceId = cookieStore.get(DEVICE_COOKIE_NAME)?.value;

  if (!deviceId) {
    deviceId = globalThis.crypto.randomUUID();
    cookieStore.set(DEVICE_COOKIE_NAME, deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: DEVICE_COOKIE_MAX_AGE_SECONDS,
      path: "/"
    });
  }

  const headerList = await headers();
  const userAgent = headerList.get("user-agent");

  await supabase.from("trusted_devices").upsert(
    {
      user_id: userId,
      device_id: deviceId,
      user_agent: userAgent,
      last_seen_at: new Date().toISOString()
    },
    { onConflict: "user_id,device_id" }
  );
}
