import { Badge, Button } from "@netlium/ui";
import { AuthShell } from "./AuthShell";
import { NetliumMark } from "./NetliumMark";

/**
 * The application entry point. Deliberately not a card — the spec calls for
 * an open, typography-only composition, not a bounded form surface. This is
 * infrastructure status, not a landing page.
 */
export function Gateway() {
  return (
    <AuthShell>
      <div className="flex flex-col items-center gap-8 text-center">
        <NetliumMark size={48} />
        <div className="space-y-3">
          <p className="text-overline font-semibold uppercase tracking-[0.2em] text-text-muted">
            Netlium Systems
          </p>
          <h1 className="text-hero font-semibold leading-tight tracking-tight text-text-warm text-balance">
            Institutional Capital Operating System
          </h1>
          <p className="text-body-sm text-text-secondary text-balance">
            Secure access to institutional-grade capital infrastructure.
          </p>
        </div>
        <Badge tone="success">Infrastructure Operational</Badge>
        <div className="flex w-full max-w-xs flex-col gap-3 pt-2">
          <Button variant="accent" size="lg" href="/signup">
            Open Netlium Account
          </Button>
          <Button variant="outline" size="lg" href="/login">
            Access Platform
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
