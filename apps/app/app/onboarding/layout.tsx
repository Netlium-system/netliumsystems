import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile, requireUser } from "@/lib/auth";

export default async function OnboardingLayout({ children }: { readonly children: ReactNode }) {
  await requireUser();
  const profile = await getCurrentProfile();

  if (profile?.provisionedAt) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
