"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "./utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-body font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:brightness-110 shadow-sm",
        secondary:
          "bg-surface-3 text-text-primary border border-border-default hover:border-border-hover",
        ghost: "bg-transparent text-text-secondary hover:bg-surface-2 hover:text-text-primary",
        outline:
          "bg-transparent text-text-primary border border-border-default hover:bg-surface-2",
        soft: "bg-primary/12 text-primary hover:bg-primary/20",
        destructive: "bg-danger text-danger-foreground hover:brightness-110 shadow-sm",
        success: "bg-success text-success-foreground hover:brightness-110 shadow-sm",
        warning: "bg-warning text-warning-foreground hover:brightness-110 shadow-sm"
      },
      size: {
        sm: "h-8 px-3 text-body-sm",
        md: "h-9 px-4",
        lg: "h-11 px-6 text-body-lg",
        icon: "h-9 w-9 p-0"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

export interface ButtonProps extends NativeButtonProps, VariantProps<typeof buttonVariants> {
  readonly loading?: boolean;
  readonly href?: string;
  readonly children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, loading, disabled, href, children, ...props },
  ref
) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const tapAnimation = disabled || loading ? {} : { whileTap: { scale: 0.97 } };

  return (
    <motion.button
      ref={ref}
      {...tapAnimation}
      className={classes}
      disabled={disabled || loading}
      {...(props as HTMLMotionProps<"button">)}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </motion.button>
  );
});
