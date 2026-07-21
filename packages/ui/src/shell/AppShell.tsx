import type { ReactElement, ReactNode } from "react";

export interface AppShellProps {
  readonly children: ReactNode;
  readonly sidebar?: ReactNode;
  readonly header?: ReactNode;
  readonly mobileNavigation?: ReactNode;
}

export function AppShell({ children, sidebar, header, mobileNavigation }: AppShellProps): ReactElement {
  return (
    <div className="min-h-screen min-h-dvh bg-canvas text-text-primary">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(11,140,255,0.13),transparent_34%),radial-gradient(ellipse_at_top_right,rgba(84,55,255,0.08),transparent_30%)]" />
      <div className="flex min-h-screen min-h-dvh">
        {sidebar && (
          <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 border-r border-border-hairline bg-sidebar/96 px-3 py-4 lg:block xl:w-60">
            {sidebar}
          </aside>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          {header}
          <main className="flex-1 overflow-x-hidden px-4 pb-[calc(env(safe-area-inset-bottom)+6rem)] pt-5 sm:px-6 md:px-7 lg:px-8 lg:pb-8">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
      {mobileNavigation}
    </div>
  );
}
