import type { ReactElement, ReactNode } from "react";

export interface HeaderProps {
  readonly title: string;
  readonly actions?: ReactNode;
}

export function Header({ title, actions }: HeaderProps): ReactElement {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-border-hairline bg-topnav px-6 md:px-8">
      <h1 className="text-h4 font-semibold tracking-tight text-text-primary">{title}</h1>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </header>
  );
}
