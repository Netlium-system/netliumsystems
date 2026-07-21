"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, type ReactElement, type ReactNode } from "react";
import type { NavItem } from "./Sidebar";
import { cn } from "../components/utils/cn";

export interface MobileNavigationProps {
  readonly primaryItems: readonly NavItem[];
  readonly menuItems: readonly NavItem[];
  readonly footer?: ReactNode;
}

const GROUP_ORDER = ["Operations", "Records", "Account", "Admin", "Workspace", "Core"] as const;

function groupItems(items: readonly NavItem[]): Array<readonly [string, readonly NavItem[]]> {
  const groups = items.reduce<Record<string, NavItem[]>>((acc, item) => {
    const group = item.group ?? "Account";
    acc[group] = [...(acc[group] ?? []), item];
    return acc;
  }, {});

  return Object.entries(groups).sort(([a], [b]) => {
    const aIndex = GROUP_ORDER.indexOf(a as (typeof GROUP_ORDER)[number]);
    const bIndex = GROUP_ORDER.indexOf(b as (typeof GROUP_ORDER)[number]);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
}

export function MobileNavigation({ primaryItems, menuItems, footer }: MobileNavigationProps): ReactElement {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-surface-overlay backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <nav
        aria-label="Mobile dashboard"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border-hairline bg-sidebar/95 px-[max(env(safe-area-inset-left),0.5rem)] pb-[calc(env(safe-area-inset-bottom)+0.375rem)] pt-1.5 backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {primaryItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[0.69rem] font-medium focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)]",
                  isActive ? "bg-surface-2 text-text-primary" : "text-text-muted hover:text-text-primary"
                )}
                onClick={() => setIsOpen(false)}
              >
                <span className={cn("[&>svg]:size-4", isActive ? "text-accent-primary" : "text-text-muted")} aria-hidden="true">
                  {item.icon}
                </span>
                <span className="max-w-full truncate">{item.label.replace("Neptlium ", "")}</span>
              </Link>
            );
          })}

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-dashboard-menu"
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[0.69rem] font-medium focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)]",
              isOpen ? "bg-surface-2 text-text-primary" : "text-text-muted hover:text-text-primary"
            )}
            onClick={() => setIsOpen((current) => !current)}
          >
            <Menu className="size-4" aria-hidden="true" />
            <span>More</span>
          </button>
        </div>
      </nav>

      <aside
        id="mobile-dashboard-menu"
        aria-label="More dashboard destinations"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[min(86svh,42rem)] rounded-t-2xl border border-border-default bg-surface-1 shadow-lg transition-transform duration-150 ease-out lg:hidden",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border-hairline px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-text-primary">Menu</p>
            <p className="text-xs text-text-muted">Capital operations and account</p>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="flex size-10 items-center justify-center rounded-lg text-text-muted hover:bg-surface-2 hover:text-text-primary focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)]"
            onClick={() => setIsOpen(false)}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[calc(min(86svh,42rem)-4rem)] overflow-y-auto px-3 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] pt-3">
          <div className="space-y-5">
            {groupItems(menuItems).map(([group, items]) => (
              <section key={group} aria-labelledby={`mobile-${group.toLowerCase()}-nav`}>
                <p id={`mobile-${group.toLowerCase()}-nav`} className="px-2 pb-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-text-disabled">
                  {group}
                </p>
                <div className="space-y-1">
                  {items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
                    return (
                      <Link
                        key={`${group}-${item.href}-${item.label}`}
                        href={item.href}
                        className={cn(
                          "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)]",
                          isActive ? "bg-surface-2 text-text-primary" : "text-text-secondary hover:bg-surface-2/70 hover:text-text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className={cn("text-text-muted [&>svg]:size-4", isActive && "text-accent-primary")} aria-hidden="true">
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}

            {footer && <div className="border-t border-border-hairline px-2 pt-4">{footer}</div>}
          </div>
        </div>
      </aside>
    </>
  );
}
