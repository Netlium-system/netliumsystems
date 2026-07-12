import { headers } from "next/headers";

export function readRequiredField(formData: FormData, field: string): string | null {
  const value = formData.get(field);
  return typeof value === "string" && value.length > 0 ? value : null;
}

/**
 * Resolves the app's public origin for building absolute redirect URLs (e.g.
 * Supabase's emailRedirectTo). Server actions have no request URL of their
 * own, so this prefers an explicit env var and falls back to the forwarded
 * host headers set by the platform's proxy.
 */
export async function resolveOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}
