"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import { cn } from "../components/utils/cn";

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon?: ReactNode;
}

export interface SidebarProps {
  readonly items: readonly NavItem[];
}

export function Sidebar({ items }: SidebarProps): ReactElement {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-sm border-l-2 px-3 py-2 text-body-sm font-medium transition-colors duration-150 ease-out",
              isActive
                ? "border-accent-emerald bg-surface-3 text-text-primary"
                : "border-transparent text-text-secondary hover:bg-surface-2 hover:text-text-primary"
            )}
          >
            {item.icon && (
              <span className={cn("shrink-0", isActive ? "text-accent-emerald" : "text-text-muted")} aria-hidden="true">
                {item.icon}
              </span>
            )}
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
