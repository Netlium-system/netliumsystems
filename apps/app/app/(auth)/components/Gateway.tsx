import { Button } from "@netlium/ui";
import { AuthShell } from "./AuthShell";

/**
 * The application entry point. Deliberately not a card — the spec calls for
 * an open, typography-only composition, not a bounded form surface. This is
 * infrastructure status, not a landing page.
 */
export function Gateway() {
  return (
    <AuthShell>
      <div className="flex flex-col gap-8">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Neptlium Systems
          </p>
          <h1 className="text-[40px] font-semibold leading-[1.1] tracking-tight text-text-primary text-balance sm:text-[48px]">
            Institutional Capital<br />Operating System
          </h1>
          <p className="max-w-sm text-[15px] text-text-muted text-balance">
            Secure access to your institutional capital environment.
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Button variant="cta" size="lg" href="/signup" className="h-12 rounded-full font-semibold">
            Create Neptlium Account
          </Button>
          <Button variant="outline" size="lg" href="/login" className="h-12 rounded-full">
            Sign In
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
