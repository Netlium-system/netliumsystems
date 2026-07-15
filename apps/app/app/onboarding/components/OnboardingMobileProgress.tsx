import type { OnboardingStepKey } from "../wizard-steps";
import { onboardingSteps } from "../wizard-steps";

export interface OnboardingMobileProgressProps {
  readonly currentStepKey: OnboardingStepKey;
}

export function OnboardingMobileProgress({ currentStepKey }: OnboardingMobileProgressProps) {
  const currentIndex = onboardingSteps.findIndex((step) => step.key === currentStepKey);
  const stepNumber = currentIndex + 1;
  const totalSteps = onboardingSteps.length;
  const currentStepLabel = onboardingSteps[currentIndex]?.label ?? "";

  return (
    <div className="border-b border-border-hairline px-4 py-3 md:hidden">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-caption font-medium text-text-secondary">
          Step {stepNumber} of {totalSteps}
        </span>
        <span className="truncate text-caption text-text-muted">{currentStepLabel}</span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-border-default"
        role="progressbar"
        aria-valuenow={stepNumber}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${stepNumber} of ${totalSteps}: ${currentStepLabel}`}
      >
        <div
          className="h-full rounded-full bg-accent-primary transition-all duration-300 ease-out"
          style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
