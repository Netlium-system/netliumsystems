"use client";

import { ArrowLeftRight, Landmark } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  StatCard,
} from "@netlium/ui";

export function TreasuryView() {
  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-text-primary">
          Treasury Operations
        </h1>
        <p className="mt-1 text-[13px] text-text-muted">
          Institutional account management and settlement operations
        </p>
      </div>

      {/* Stats — no real data available */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Treasury Accounts" value="—" />
        <StatCard label="Total Liquidity" value="—" />
        <StatCard label="Settlement Pending" value="—" />
        <StatCard label="YTD Volume" value="—" />
      </div>

      {/* Treasury Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Treasury Accounts</CardTitle>
        </CardHeader>
        <CardContent className="py-10">
          <EmptyState
            icon={<Landmark className="size-5" aria-hidden="true" />}
            title="No treasury accounts configured"
            description="Treasury accounts are managed by the operations team. Contact your administrator to configure institutional accounts."
          />
        </CardContent>
      </Card>

      {/* Treasury Transfers */}
      <Card>
        <CardHeader>
          <CardTitle>Treasury Transfers</CardTitle>
        </CardHeader>
        <CardContent className="py-10">
          <EmptyState
            icon={<ArrowLeftRight className="size-5" aria-hidden="true" />}
            title="Transfers unavailable"
            description="Treasury account transfers require configured accounts and operator approval. This feature is pending backend configuration."
          />
        </CardContent>
      </Card>

      {/* Backend integration notice */}
      <div className="rounded-md border border-border-default bg-surface-2 px-4 py-4 space-y-1.5">
        <p className="text-[13px] font-semibold text-text-primary">Backend integration required</p>
        <p className="text-[12px] text-text-muted leading-relaxed">
          The treasury operations module requires connection to institutional banking infrastructure
          and treasury management APIs. This functionality is pending deployment. See the backend
          integration documentation for requirements.
        </p>
      </div>
    </div>
  );
}
