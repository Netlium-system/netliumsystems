"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";

export async function adminSignOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/login");
}
