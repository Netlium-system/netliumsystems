import { ShieldCheck } from "lucide-react";
import { Card, EmptyState } from "@netlium/ui";
import { requireRole } from "@/lib/auth";

export default async function AdministrationPage() {
  await requireRole("admin");

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-h1 font-semibold tracking-tight text-text-primary">Administration</h1>
        <p className="mt-2 text-body text-text-secondary">Platform governance, roles, and system oversight</p>
      </div>

      <Card>
        <EmptyState
          icon={<ShieldCheck className="size-5" aria-hidden="true" />}
          title="No administrative actions pending"
          description="User, role, and platform governance tools will appear here."
        />
      </Card>
    </div>
  );
}
