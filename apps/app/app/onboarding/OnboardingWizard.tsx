"use client";

import { useReducer } from "react";
import { AnimatePresence } from "framer-motion";
import { Stepper } from "@netlium/ui";
import { isOrganizationPurpose, type ProvisioningPayload } from "@netlium/lib";
import { StepTransition } from "../(auth)/components/StepTransition";
import { AuthCard } from "../(auth)/components/AuthCard";
import { NetliumMark } from "../(auth)/components/NetliumMark";
import { onboardingSteps } from "./wizard-steps";
import { initialWizardState, wizardReducer } from "./wizardReducer";
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
    <div className="flex flex-col items-center gap-10">
      <NetliumMark size={28} />
      <Stepper
        steps={onboardingSteps}
        currentStepKey={currentStep.key}
        completedStepKeys={completedStepKeys}
        className="w-full max-w-xl"
      />
      <AuthCard size="wide">
        <AnimatePresence mode="wait" initial={false}>
          <StepTransition key={currentStep.key} stepKey={currentStep.key}>
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
      </AuthCard>
    </div>
  );
}
