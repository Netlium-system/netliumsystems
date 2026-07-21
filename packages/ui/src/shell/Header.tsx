import type { ReactElement, ReactNode } from "react";

export interface HeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly leading?: ReactNode;
  readonly actions?: ReactNode;
}

export function Header({ title, subtitle, leading, actions }: HeaderProps): ReactElement {
  return (
    <header className="sticky top-0 z-30 min-h-16 shrink-0 border-b border-border-hairline bg-topnav/90 px-4 pt-[env(safe-area-inset-top)] backdrop-blur sm:px-6 lg:px-8">
      <div className="grid min-h-16 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-2">
        <div className="flex items-center justify-start">{leading}</div>
        <div className="min-w-0 text-left">
          <p className="truncate text-[1.25rem] font-semibold leading-tight tracking-tight text-text-primary sm:text-[1.375rem]">
            {title}
          </p>
          {subtitle && <p className="mt-0.5 hidden truncate text-caption text-text-muted sm:block">{subtitle}</p>}
        </div>
        {actions && <div className="flex min-w-10 shrink-0 items-center justify-end gap-2">{actions}</div>}
      </div>
    </header>
  );
}
