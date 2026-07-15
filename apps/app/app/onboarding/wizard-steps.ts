export const onboardingSteps = [
  { key: "identity", label: "Identity verification" },
  { key: "purpose", label: "Account mandate" },
  { key: "profile", label: "Investor profile" },
  { key: "security", label: "Security controls" },
  { key: "compliance", label: "Account certification" },
  { key: "provisioning", label: "Environment activation" }
] as const;

export type OnboardingStepKey = (typeof onboardingSteps)[number]["key"];
