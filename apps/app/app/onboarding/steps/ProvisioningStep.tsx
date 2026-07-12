"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { provisioningPayloadSchema, type ProvisioningPayload } from "@netlium/lib";
import { Button } from "@netlium/ui";
import { submitProvisioning, type ProvisioningResult } from "../actions";

const provisioningItems = [
  "Secure identity established",
  "Netlium Wallet activated",
  "Portfolio initialized",
  "Security policies applied",
  "Compliance profile registered",
  "Institutional services connected",
  "Account ready"
] as const;

const STEP_STAGGER_MS = 450;

export interface ProvisioningStepProps {
  readonly data: Partial<ProvisioningPayload>;
}

export function ProvisioningStep({ data }: ProvisioningStepProps) {
  const router = useRouter();
  const [revealedCount, setRevealedCount] = useState(0);
  const [outcome, setOutcome] = useState<ProvisioningResult | null>(null);
  const [attempt, setAttempt] = useState(0);
  const redirectedRef = useRef(false);

  useEffect(() => {
    const timers = provisioningItems.map((_, index) =>
      setTimeout(() => setRevealedCount((count) => Math.max(count, index + 1)), index * STEP_STAGGER_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const parsed = provisioningPayloadSchema.safeParse(data);
      if (!parsed.success) {
        if (!cancelled) setOutcome({ ok: false, error: "Missing information from a previous step." });
        return;
      }

      const result = await submitProvisioning(parsed.data);
      if (!cancelled) setOutcome(result);
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `attempt` retriggers a retry; `data` is stable per mount.
  }, [attempt]);

  const revealComplete = revealedCount >= provisioningItems.length;

  useEffect(() => {
    if (revealComplete && outcome?.ok && !redirectedRef.current) {
      redirectedRef.current = true;
      router.push("/dashboard");
    }
  }, [revealComplete, outcome, router]);

  const failed = revealComplete && outcome !== null && !outcome.ok;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1 text-center">
        <h1 className="text-h4 font-semibold tracking-tight text-text-warm">Provisioning</h1>
        <p className="text-body-sm text-text-secondary">Preparing your institutional environment.</p>
      </div>

      <ul className="flex flex-col gap-3">
        {provisioningItems.map((item, index) => {
          const shown = index < revealedCount;
          return (
            <li
              key={item}
              className="flex items-center gap-3 text-body-sm text-text-primary transition-all duration-200 ease-out"
              style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(4px)" }}
            >
              {shown ? (
                <Check className="size-4 shrink-0 text-accent-emerald" aria-hidden="true" />
              ) : (
                <span className="size-4 shrink-0" aria-hidden="true" />
              )}
              <span>{item}</span>
            </li>
          );
        })}
      </ul>

      {failed && (
        <div className="flex flex-col gap-3 rounded-md border border-danger/30 bg-danger/6 p-4">
          <p className="text-body-sm text-danger">{outcome && !outcome.ok ? outcome.error : "Provisioning failed."}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => {
              setOutcome(null);
              redirectedRef.current = false;
              setAttempt((value) => value + 1);
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {!failed && (
        <p className="text-center text-body-sm text-text-muted">
          {revealComplete ? "Finalizing account" : "Provisioning infrastructure"}
        </p>
      )}
    </div>
  );
}
