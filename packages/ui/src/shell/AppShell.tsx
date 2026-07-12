import type { ReactElement, ReactNode } from "react";

/**
 * AppShell — The institutional UI container for Netlium Systems.
 *
 * Provides the base layout structure:
 * - Sidebar navigation
 * - Main content area
 * - Institutional branding
 *
 * All pages should render within this shell for consistency.
 */
export interface AppShellProps {
  readonly children: ReactNode;
  readonly sidebar?: ReactNode;
  readonly header?: ReactNode;
}

export function AppShell({ children, sidebar, header }: AppShellProps): ReactElement {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-text-primary md:flex-row">
      <aside className="w-full shrink-0 border-b border-border-hairline bg-sidebar p-4 md:w-[280px] md:border-b-0 md:border-r md:p-5">
        <div className="mb-4 px-1 text-body-sm font-semibold tracking-tight text-text-secondary md:mb-8">
          Netlium
        </div>
        {sidebar && (
          <nav className="flex gap-1.5 overflow-x-auto md:block md:space-y-1 md:overflow-visible">{sidebar}</nav>
        )}
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {header}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
