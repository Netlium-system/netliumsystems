import { FileBarChart2 } from "lucide-react";
import { Card, EmptyState } from "@netlium/ui";
import { requireRole } from "@/lib/auth";

export default async function ReportsPage() {
  await requireRole("analyst");

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-h1 font-semibold tracking-tight text-text-primary">Reports</h1>
        <p className="mt-2 text-body text-text-secondary">
          Institutional statements, performance summaries, and audit reports
        </p>
      </div>

      <Card>
        <EmptyState
          icon={<FileBarChart2 className="size-5" aria-hidden="true" />}
          title="No reports available"
          description="Connect to Supabase to generate institutional reports."
        />
      </Card>
    </div>
  );
}
