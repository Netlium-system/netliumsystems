import type { ReactElement, ReactNode } from "react";
import { NeptliumMark } from "./NeptliumMark";

/**
 * AppShell — Institutional dashboard container for Neptlium.
 *
 * Desktop: fixed 240px sidebar + scrollable content area with topbar.
 * Mobile/tablet: compact sticky header + main content + optional drawer trigger.
 *
 * Props:
 *   sidebar        — nav links rendered inside the desktop sidebar
 *   sidebarFooter  — user identity + sign-out anchored to sidebar bottom
 *   mobileNav      — mobile header/navigation component
 *
 * The legacy `header` prop is retained for backward compatibility but is no
 * longer rendered — the sidebar wordmark and mobile header replace it.
 */
export interface AppShellProps {
  readonly children: ReactNode;
  readonly sidebar?: ReactNode;
  readonly sidebarFooter?: ReactNode;
  readonly mobileNav?: ReactNode;
  /** @deprecated Pass sidebarFooter instead. Retained for backward compat. */
  readonly header?: ReactNode;
}

export function AppShell({
  children,
  sidebar,
  sidebarFooter,
  mobileNav
}: AppShellProps): ReactElement {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      {/* ------------------------------------------------------------------ */}
      {/* Desktop sidebar — hidden on mobile                                  */}
      {/* ------------------------------------------------------------------ */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border-hairline bg-sidebar lg:flex">
        {/* Wordmark */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border-hairline px-5">
          <NeptliumMark size={22} />
          <span className="text-body-sm font-semibold tracking-tight text-text-primary">
            Neptlium
          </span>
        </div>

        {/* Nav items */}
        {sidebar && (
          <nav
            aria-label="Dashboard navigation"
            className="flex-1 overflow-y-auto px-3 py-3"
          >
            {sidebar}
          </nav>
        )}

        {/* Footer — user info + sign out */}
        {sidebarFooter && (
          <div className="shrink-0 border-t border-border-hairline p-3">
            {sidebarFooter}
          </div>
        )}
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Main content column (offset by sidebar on desktop)                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col lg:pl-60">
        {/* Mobile compact header */}
        <header className="sticky top-0 z-20 h-14 shrink-0 border-b border-border-hairline bg-topnav lg:hidden">
          {mobileNav ?? (
            <div className="flex h-full items-center gap-2.5 px-4">
              <NeptliumMark size={20} />
              <span className="text-body-sm font-semibold tracking-tight text-text-primary">
                Neptlium
              </span>
            </div>
          )}
        </header>

        {/* Desktop topbar placeholder — keeps content below fixed sidebar header */}
        <div className="hidden h-14 shrink-0 border-b border-border-hairline bg-topnav lg:block" aria-hidden="true" />

        {/* Page content */}
        <main className="flex-1 overflow-auto px-4 py-6 md:px-6 md:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
