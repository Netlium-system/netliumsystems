import { Button } from "@netlium/ui";
import { AuthShell } from "./AuthShell";
import { NeptliumMark } from "./NeptliumMark";

/**
 * The application entry point. Deliberately not a card — the spec calls for
 * an open, typography-only composition, not a bounded form surface. This is
 * infrastructure status, not a landing page.
 */
export function Gateway() {
  return (
    <AuthShell>
      <div className="flex flex-col items-center gap-8 text-center">
        <NeptliumMark size={48} />
        <div className="space-y-3">
          <p className="text-overline font-semibold uppercase tracking-[0.2em] text-text-muted">
            Neptlium Systems
          </p>
          <h1 className="text-hero font-semibold leading-tight tracking-tight text-text-primary text-balance">
            Institutional Capital Operating System
          </h1>
          <p className="mx-auto max-w-sm text-body-sm text-text-secondary text-balance">
            Secure access to your institutional capital environment.
          </p>
          <p className="mx-auto max-w-md text-body-sm text-text-muted text-balance">
            Establish or access a governed environment for portfolio, treasury, wallet, document, and capital operations.
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3 pt-2">
          <Button variant="accent" size="lg" href="/signup">
            Create Neptlium Account
          </Button>
          <Button variant="outline" size="lg" href="/login">
            Sign In
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
