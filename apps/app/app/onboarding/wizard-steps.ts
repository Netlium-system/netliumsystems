export const onboardingSteps = [
  { key: "purpose", label: "Purpose" },
  { key: "profile", label: "Profile" },
  { key: "security", label: "Security" },
  { key: "compliance", label: "Compliance" },
  { key: "provisioning", label: "Provisioning" }
] as const;

export type OnboardingStepKey = (typeof onboardingSteps)[number]["key"];
