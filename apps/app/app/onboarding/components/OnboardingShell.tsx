"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingProgress } from "./OnboardingProgress";
import { OnboardingMobileProgress } from "./OnboardingMobileProgress";
import type { OnboardingStepKey } from "../wizard-steps";

export interface OnboardingShellProps {
  readonly children: ReactNode;
  readonly currentStepKey: OnboardingStepKey;
  readonly completedStepKeys: readonly string[];
}

/**
 * Dedicated onboarding shell — replaces AuthShell for the onboarding wizard.
 *
 * Desktop (≥ md): full header above; below: centered max-1120px container
 * with 240–280px left rail (progress) and a right main panel (680–760px).
 * Normal document scroll, no fixed height, no overflow clipping.
 *
 * Mobile: header (mark + wordmark only) + mobile progress bar;
 * single-column full-width panel with 16px horizontal padding.
 */
export function OnboardingShell({ children, currentStepKey, completedStepKeys }: OnboardingShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh flex flex-col bg-canvas">
        <OnboardingHeader />

        {/* Mobile progress bar — hidden on desktop */}
        <OnboardingMobileProgress
          currentStepKey={currentStepKey}
          completedStepKeys={completedStepKeys}
        />

        {/* Workspace */}
        <div className="flex flex-1 justify-center px-4 pb-12 pt-6 sm:px-6 md:px-8">
          <div className="flex w-full max-w-[1120px] gap-10 md:gap-12">
            {/* Left rail — desktop only */}
            <aside
              className="hidden md:flex md:w-[260px] lg:w-[280px] shrink-0 flex-col pt-1"
              aria-label="Account opening steps"
            >
              <OnboardingProgress
                currentStepKey={currentStepKey}
                completedStepKeys={completedStepKeys}
              />
            </aside>

            {/* Main panel */}
            <main className="min-w-0 flex-1">
              {children}
            </main>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
