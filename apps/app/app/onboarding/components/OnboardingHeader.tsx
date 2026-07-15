import { NeptliumMark } from "../../(auth)/components/NeptliumMark";

export function OnboardingHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border-hairline bg-canvas px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2.5">
        <NeptliumMark size={24} />
        <div className="flex items-baseline gap-2">
          <span className="text-body font-semibold tracking-tight text-text-primary">NEPTLIUM</span>
          <span className="hidden text-caption text-text-muted sm:inline">Institutional Capital Operating System</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-caption font-medium text-text-secondary">Secure account opening</span>
        <span className="text-caption text-text-muted">Approximately 2 minutes</span>
      </div>
    </header>
  );
}
