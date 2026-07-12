import { SlidersHorizontal } from "lucide-react";
import { Card, EmptyState } from "@netlium/ui";
import { requireRole } from "@/lib/auth";

export default async function AllocationsPage() {
  await requireRole("analyst");

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-h1 font-semibold tracking-tight text-text-primary">Capital Allocations</h1>
        <p className="mt-2 text-body text-text-secondary">
          Manage capital allocation across strategies and mandates
        </p>
      </div>

      <Card>
        <EmptyState
          icon={<SlidersHorizontal className="size-5" aria-hidden="true" />}
          title="No allocations configured"
          description="Connect to Supabase to manage capital allocations."
        />
      </Card>
    </div>
  );
}
