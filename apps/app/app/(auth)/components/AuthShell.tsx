"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { AuthBackground } from "./AuthBackground";
import { TrustFooter } from "./TrustFooter";
import { NeptliumMark } from "./NeptliumMark";

export interface AuthShellProps {
  readonly children: ReactNode;
}

/**
 * Auth shell layout.
 *
 * Content is top-anchored (not vertically centered) so that step transitions
 * — which change content height — never shift the heading up or down.
 * The wordmark sits in a fixed-height bar; the form column starts at a
 * consistent offset below it on every step.
 */
export function AuthShell({ children }: AuthShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate flex min-h-screen min-h-dvh flex-col px-6 py-10 sm:px-10">
        <AuthBackground />

        {/* Wordmark — fixed 40px height, never shifts */}
        <div className="flex h-10 shrink-0 items-center gap-2.5">
          <NeptliumMark size={30} />
          <span className="select-none text-[13px] font-semibold uppercase tracking-[0.12em] text-text-primary">
            NEPTLIUM
          </span>
        </div>

        {/* Form column — top-anchored with fixed offset, never vertically centered */}
        <div className="mx-auto w-full max-w-[420px] pt-14">
          {children}
        </div>

        {/* Trust footer — pushed to bottom */}
        <div className="mt-auto flex w-full justify-center pt-10">
          <TrustFooter />
        </div>
      </div>
    </MotionConfig>
  );
}
