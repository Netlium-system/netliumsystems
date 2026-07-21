import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from "@netlium/ui";

export function PageHeader({ title, eyebrow, description, actions }: { readonly title: string; readonly eyebrow?: string; readonly description?: string; readonly actions?: ReactNode }) {
  return <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="min-w-0">{eyebrow && <p className="text-[0.7rem] font-medium uppercase tracking-[0.14em] text-accent-primary">{eyebrow}</p>}<h1 className="mt-1 text-[1.35rem] font-semibold leading-tight tracking-tight text-text-primary sm:text-2xl">{title}</h1>{description && <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{description}</p>}</div>{actions && <div className="flex shrink-0 gap-2">{actions}</div>}</div>;
}

export function DashboardSection({ title, description, children, className }: { readonly title: string; readonly description?: string; readonly children: ReactNode; readonly className?: string }) {
  return <Card className={className}><CardHeader><CardTitle>{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</CardHeader><CardContent>{children}</CardContent></Card>;
}

export function MetricRow({ label, value, tone = "default" }: { readonly label: string; readonly value: string; readonly tone?: "default" | "muted" | "success" | "warning" }) {
  return <div className="flex min-h-11 items-center justify-between gap-4 border-b border-border-hairline py-2 last:border-0"><span className="text-sm text-text-secondary">{label}</span><span className={cn("truncate text-right font-mono text-sm tabular-nums", tone === "muted" ? "text-text-muted" : tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-text-primary")}>{value}</span></div>;
}

export function QuickAction({ href, label, description, icon }: { readonly href: string; readonly label: string; readonly description: string; readonly icon: ReactNode }) {
  return <Link href={href} className="flex min-h-14 items-center gap-3 rounded-lg border border-border-default bg-surface-2/55 p-3 transition hover:border-border-hover hover:bg-surface-2 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)]"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-primary/12 text-accent-primary [&>svg]:size-4" aria-hidden="true">{icon}</span><span className="min-w-0"><span className="block text-sm font-medium text-text-primary">{label}</span><span className="block truncate text-xs text-text-muted">{description}</span></span></Link>;
}
