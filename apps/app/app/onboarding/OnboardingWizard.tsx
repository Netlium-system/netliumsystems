"use client";

import { useReducer } from "react";
import { AnimatePresence } from "framer-motion";
import { isOrganizationPurpose, type ProvisioningPayload } from "@netlium/lib";
import { StepTransition } from "../(auth)/components/StepTransition";
import { OnboardingShell } from "./components/OnboardingShell";
import { OnboardingPanel } from "./components/OnboardingPanel";
import { onboardingSteps } from "./wizard-steps";
import { initialWizardState, wizardReducer } from "./wizardReducer";
import { IdentityStep } from "./steps/IdentityStep";
import { PurposeStep } from "./steps/PurposeStep";
import { IndividualProfileStep } from "./steps/IndividualProfileStep";
import { OrganizationProfileStep } from "./steps/OrganizationProfileStep";
import { SecurityStep } from "./steps/SecurityStep";
import { ComplianceStep } from "./steps/ComplianceStep";
import { ProvisioningStep } from "./steps/ProvisioningStep";

export function OnboardingWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const currentStep = onboardingSteps[state.stepIndex] ?? onboardingSteps[0];
  const completedStepKeys = onboardingSteps.slice(0, state.stepIndex).map((step) => step.key);

  function handleNext(payload?: Partial<ProvisioningPayload>) {
    dispatch(payload ? { type: "NEXT", payload } : { type: "NEXT" });
  }

  function handleBack() {
    dispatch({ type: "BACK" });
  }

  return (
    <OnboardingShell
      currentStepKey={currentStep.key}
      completedStepKeys={completedStepKeys}
    >
      <OnboardingPanel>
        <AnimatePresence mode="wait" initial={false}>
          <StepTransition key={currentStep.key} stepKey={currentStep.key}>
            {currentStep.key === "identity" && <IdentityStep data={state.data} onNext={handleNext} />}
            {currentStep.key === "purpose" && <PurposeStep data={state.data} onNext={handleNext} />}
            {currentStep.key === "profile" &&
              (state.data.investorType && isOrganizationPurpose(state.data.investorType) ? (
                <OrganizationProfileStep data={state.data} onNext={handleNext} onBack={handleBack} />
              ) : (
                <IndividualProfileStep data={state.data} onNext={handleNext} onBack={handleBack} />
              ))}
            {currentStep.key === "security" && <SecurityStep onNext={() => handleNext()} onBack={handleBack} />}
            {currentStep.key === "compliance" && <ComplianceStep onNext={handleNext} onBack={handleBack} />}
            {currentStep.key === "provisioning" && <ProvisioningStep data={state.data} />}
          </StepTransition>
        </AnimatePresence>
      </OnboardingPanel>
    </OnboardingShell>
  );
}
