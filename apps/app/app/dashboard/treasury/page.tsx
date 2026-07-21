import { Landmark } from "lucide-react";
import { Card, CardHeader, CardTitle, EmptyState } from "@netlium/ui";
import type { TreasuryAccount } from "@netlium/types";
import { requireRole } from "@/lib/auth";

const treasuryAccounts: readonly TreasuryAccount[] = [];

export default async function TreasuryPage() {
  await requireRole("operator");

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-[1.35rem] font-semibold leading-tight tracking-tight text-text-primary sm:text-2xl">Treasury Operations</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Manage accounts, transactions, and liquidity
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treasury Accounts</CardTitle>
        </CardHeader>

        {treasuryAccounts.length === 0 ? (
          <EmptyState
            icon={<Landmark className="size-5" aria-hidden="true" />}
            title="No treasury accounts configured"
            description="Treasury accounts will appear here when your permitted Supabase records are available."
          />
        ) : (
          <div className="overflow-x-auto p-6 pt-0">
            <table className="w-full text-body-sm">
              <thead className="border-b border-border-default">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-text-secondary">Account Name</th>
                  <th className="px-4 py-2 text-left font-medium text-text-secondary">Type</th>
                  <th className="px-4 py-2 text-left font-medium text-text-secondary">Currency</th>
                  <th className="px-4 py-2 text-left font-medium text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {treasuryAccounts.map((account) => (
                  <tr key={account.id} className="border-b border-border-hairline">
                    <td className="px-4 py-2 text-text-primary">{account.name}</td>
                    <td className="px-4 py-2 text-text-primary">{account.accountType}</td>
                    <td className="px-4 py-2 text-text-primary">{account.currency}</td>
                    <td className="px-4 py-2 text-text-primary">{account.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
