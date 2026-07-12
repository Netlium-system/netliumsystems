import type { SupabaseClient } from "@supabase/supabase-js";

export type NotificationCategory = "security" | "deposit" | "withdrawal" | "allocation" | "document" | "system";

export async function createNotification(
  supabase: SupabaseClient,
  userId: string,
  category: NotificationCategory,
  title: string,
  body?: string
): Promise<void> {
  await supabase.from("notifications").insert({
    user_id: userId,
    category,
    title,
    body: body ?? null
  });
}
