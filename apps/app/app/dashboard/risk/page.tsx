import { ShieldAlert } from "lucide-react";
import { Card, EmptyState } from "@netlium/ui";
import { requireRole } from "@/lib/auth";

export default async function RiskPage() {
  await requireRole("manager");

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-[1.35rem] font-semibold leading-tight tracking-tight text-text-primary sm:text-2xl">Risk Monitoring</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Track exposure, limits, and institutional risk metrics
        </p>
      </div>

      <Card>
        <EmptyState
          icon={<ShieldAlert className="size-5" aria-hidden="true" />}
          title="No risk data available"
          description="Connect to Supabase to monitor risk exposure."
        />
      </Card>
    </div>
  );
}
