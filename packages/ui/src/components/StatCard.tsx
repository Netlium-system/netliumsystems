import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "./utils/cn";

export interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
  readonly deltaTone?: "positive" | "negative" | "neutral";
  readonly icon?: ReactNode;
  readonly className?: string;
}

const deltaToneClasses: Record<NonNullable<StatCardProps["deltaTone"]>, string> = {
  positive: "text-success",
  negative: "text-danger",
  neutral: "text-text-muted"
};

export function StatCard({ label, value, delta, deltaTone = "neutral", icon, className }: StatCardProps) {
  return (
    <Card elevation="raised" className={cn("p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.8125rem] font-medium text-text-secondary">{label}</p>
        {icon && <span className="text-text-muted [&>svg]:size-4">{icon}</span>}
      </div>
      <p className="mt-2 truncate font-mono text-[1.45rem] font-semibold leading-tight text-text-primary sm:text-[1.65rem]">{value}</p>
      {delta && <p className={cn("mt-1 text-caption", deltaToneClasses[deltaTone])}>{delta}</p>}
    </Card>
  );
}
