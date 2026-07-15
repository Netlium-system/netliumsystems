"use client";

import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "./utils/cn";

export const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(function Checkbox({ className, ...props }, ref) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-xs border border-border-default bg-surface-2 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)] data-[state=checked]:border-accent-emerald data-[state=checked]:bg-accent-emerald",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="text-accent-emerald-foreground">
        <Check className="size-3" aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
