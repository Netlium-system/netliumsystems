import { Newspaper } from "lucide-react";
import { Card, EmptyState } from "@netlium/ui";
import { requireUser } from "@/lib/auth";

export default async function ResearchPage() {
  await requireUser();

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-h1 font-semibold tracking-tight text-text-primary">Research</h1>
        <p className="mt-2 text-body text-text-secondary">Market insight and institutional research coverage</p>
      </div>

      <Card>
        <EmptyState
          icon={<Newspaper className="size-5" aria-hidden="true" />}
          title="No research available"
          description="Research coverage will appear here as it's published."
        />
      </Card>
    </div>
  );
}
