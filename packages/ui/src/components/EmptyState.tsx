import type { ReactNode } from "react";
import { cn } from "./utils/cn";

export interface EmptyStateProps {
  readonly icon?: ReactNode;
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-12 text-center", className)}>
      {icon && (
        <span className="flex size-10 items-center justify-center rounded-full bg-surface-3 text-text-muted">
          {icon}
        </span>
      )}
      <div className="space-y-1">
        <p className="text-body font-medium text-text-secondary">{title}</p>
        {description && <p className="text-body-sm text-text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
