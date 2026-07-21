"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { cn } from "../components/utils/cn";

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon?: ReactNode;
  readonly group?: string;
}

export interface SidebarProps {
  readonly items: readonly NavItem[];
  readonly footer?: ReactNode;
}

export function Sidebar({ items, footer }: SidebarProps): ReactElement {
  const pathname = usePathname();
  const groups = items.reduce<Record<string, NavItem[]>>((acc, item) => {
    const group = item.group ?? "Overview";
    acc[group] = [...(acc[group] ?? []), item];
    return acc;
  }, {});

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        href="/dashboard"
        className="mb-6 flex h-11 items-center gap-3 rounded-lg px-2 focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)]"
      >
        <span className="flex size-8 items-center justify-center rounded-lg border border-border-default bg-surface-2 text-sm font-semibold text-accent-primary">
          N
        </span>
        <span className="text-sm font-semibold tracking-tight text-text-primary">Neptlium</span>
      </Link>

      <nav aria-label="Dashboard" className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        {Object.entries(groups).map(([group, groupItems]) => (
          <div key={group} className="space-y-1">
            <p className="px-2 pb-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-text-disabled">
              {group}
            </p>
            {groupItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={`${group}-${item.href}-${item.label}`}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center gap-2.5 rounded-lg border border-transparent px-2.5 text-[0.8125rem] font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)]",
                    isActive
                      ? "border-border-default bg-surface-2 text-text-primary"
                      : "text-text-muted hover:bg-surface-2/70 hover:text-text-primary"
                  )}
                >
                  {item.icon && (
                    <span className={cn("shrink-0", isActive ? "text-accent-primary" : "text-text-muted")} aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {footer && <div className="mt-5 shrink-0 border-t border-border-hairline pt-4">{footer}</div>}
    </div>
  );
}
