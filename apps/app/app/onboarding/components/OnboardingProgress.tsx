import { Check } from "lucide-react";
import { cn } from "@netlium/ui";
import type { OnboardingStepKey } from "../wizard-steps";
import { onboardingSteps } from "../wizard-steps";

export interface OnboardingProgressProps {
  readonly currentStepKey: OnboardingStepKey;
  readonly completedStepKeys: readonly string[];
}

type StepStatus = "upcoming" | "current" | "completed";

function resolveStatus(key: string, currentStepKey: string, completedStepKeys: readonly string[]): StepStatus {
  if (completedStepKeys.includes(key)) return "completed";
  if (key === currentStepKey) return "current";
  return "upcoming";
}

/**
 * Desktop: vertical ordered rail — number/check, label, connector, aria-current.
 * Mobile: "Step X of 6" text + progress bar (no horizontal stepper).
 */
export function OnboardingProgress({ currentStepKey, completedStepKeys }: OnboardingProgressProps) {
  const currentIndex = onboardingSteps.findIndex((s) => s.key === currentStepKey);
  const stepNumber = currentIndex + 1;
  const totalSteps = onboardingSteps.length;
  const currentStepLabel = onboardingSteps[currentIndex]?.label ?? "";

  return (
    <>
      {/* Mobile progress — step counter + progress bar */}
      <div className="md:hidden px-4 py-3 border-b border-border-hairline">
        <div className="flex items-center justify-between mb-2">
          <span className="text-caption font-medium text-text-secondary">
            Step {stepNumber} of {totalSteps}
          </span>
          <span className="text-caption text-text-muted">{currentStepLabel}</span>
        </div>
        <div
          className="h-1 w-full rounded-full bg-border-default overflow-hidden"
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

      {/* Desktop: vertical rail */}
      <nav
        className="hidden md:flex flex-col gap-0 w-full"
        aria-label="Account opening progress"
      >
        <ol className="flex flex-col">
          {onboardingSteps.map((step, index) => {
            const status = resolveStatus(step.key, currentStepKey, completedStepKeys);
            const isLast = index === onboardingSteps.length - 1;

            return (
              <li key={step.key} className="flex items-stretch gap-3">
                {/* Connector column */}
                <div className="flex flex-col items-center">
                  <div
                    aria-current={status === "current" ? "step" : undefined}
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border text-caption font-medium transition-colors duration-180 ease-out",
                      status === "upcoming" && "border-border-default text-text-muted",
                      status === "current" && "border-accent-primary text-accent-primary bg-accent-primary/8",
                      status === "completed" && "border-accent-primary bg-accent-primary/12 text-accent-primary"
                    )}
                  >
                    {status === "completed" ? (
                      <Check className="size-3.5" aria-hidden="true" />
                    ) : (
                      <span aria-hidden="true">{index + 1}</span>
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "w-px flex-1 my-1 bg-border-default transition-colors duration-180 ease-out",
                        status === "completed" && "bg-accent-primary/30"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Label */}
                <div className={cn("pb-6 pt-0.5", isLast && "pb-0")}>
                  <span
                    className={cn(
                      "text-body-sm font-medium transition-colors duration-180 ease-out",
                      status === "upcoming" && "text-text-muted",
                      status === "current" && "text-text-primary",
                      status === "completed" && "text-text-secondary"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
