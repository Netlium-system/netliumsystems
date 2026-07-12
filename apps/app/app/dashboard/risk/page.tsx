import { ShieldAlert } from "lucide-react";
import { Card, EmptyState } from "@netlium/ui";
import { requireRole } from "@/lib/auth";

export default async function RiskPage() {
  await requireRole("manager");

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-h1 font-semibold tracking-tight text-text-primary">Risk Monitoring</h1>
        <p className="mt-2 text-body text-text-secondary">
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
