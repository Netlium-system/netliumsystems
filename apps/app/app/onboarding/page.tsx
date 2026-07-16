import { requireUser } from "@/lib/auth";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function OnboardingPage() {
  const user = await requireUser();

  return <OnboardingWizard email={user.email ?? "Verified account"} />;
}
