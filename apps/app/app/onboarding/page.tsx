import { requireUser } from "@/lib/auth";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function OnboardingPage() {
  await requireUser();

  return <OnboardingWizard />;
}
