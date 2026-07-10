import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-caption font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-surface-3 text-text-secondary",
        primary: "bg-primary/12 text-primary",
        success: "bg-success/12 text-success",
        warning: "bg-warning/12 text-warning",
        danger: "bg-danger/12 text-danger",
        info: "bg-info/12 text-info"
      }
    },
    defaultVariants: {
      tone: "neutral"
    }
  }
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export type Status =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "active"
  | "inactive"
  | "healthy"
  | "critical";

const statusConfig: Record<Status, { readonly label: string; readonly tone: NonNullable<BadgeProps["tone"]> }> = {
  pending: { label: "Pending", tone: "neutral" },
  processing: { label: "Processing", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "neutral" },
  healthy: { label: "Healthy", tone: "success" },
  critical: { label: "Critical", tone: "danger" }
};

const dotToneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-text-muted",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info"
};

export interface StatusChipProps {
  readonly status: Status;
  readonly className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status];
  return (
    <Badge tone={config.tone} className={className}>
      <span className={cn("size-1.5 rounded-full", dotToneClasses[config.tone])} aria-hidden="true" />
      {config.label}
    </Badge>
  );
}
