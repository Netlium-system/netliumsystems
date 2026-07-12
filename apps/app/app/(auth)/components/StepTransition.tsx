"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { MOTION_DURATION, MOTION_EASE } from "@netlium/ui";

export interface StepTransitionProps {
  readonly stepKey: string;
  readonly children: ReactNode;
}

const variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 }
};

export function StepTransition({ stepKey, children }: StepTransitionProps) {
  return (
    <motion.div
      key={stepKey}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: MOTION_DURATION.normal, ease: MOTION_EASE.out }}
    >
      {children}
    </motion.div>
  );
}
