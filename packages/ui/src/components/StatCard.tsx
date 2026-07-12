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
    <Card elevation="raised" className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <p className="text-body-sm font-medium text-text-secondary">{label}</p>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>
      <p className="mt-2 font-mono text-h2 font-semibold text-text-primary">{value}</p>
      {delta && <p className={cn("mt-1 text-body-sm", deltaToneClasses[deltaTone])}>{delta}</p>}
    </Card>
  );
}
