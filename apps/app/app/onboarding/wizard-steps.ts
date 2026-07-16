export const onboardingSteps = [
  { key: "provision-account", label: "Provision Account" },
  { key: "profile", label: "Profile" },
  { key: "purpose", label: "Purpose" },
  { key: "identity", label: "Identity" },
  { key: "security", label: "Security" },
  { key: "review", label: "Review" },
  { key: "provisioning", label: "Workspace Provisioning" },
  { key: "ready", label: "Account Ready" }
] as const;

export type OnboardingStepKey = (typeof onboardingSteps)[number]["key"];
