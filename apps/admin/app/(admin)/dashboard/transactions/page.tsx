import { requireAdminUser } from "@/lib/auth";
import { getTransactions, PAGE_SIZE } from "@/lib/data/transactions";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PaginationRow } from "@/components/admin/PaginationRow";
import Link from "next/link";

function formatAmount(amount: number | null, asset: string | null): string {
  if (amount === null) return "—";
  const symbol = asset === "USD" ? "$" : `${asset ?? ""} `;
  return `${symbol}${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default async function TransactionsPage({
  searchParams
}: {
  readonly searchParams: Promise<{ page?: string; type?: string; status?: string }>;
}) {
  await requireAdminUser();
  const params = await searchParams;
  const page = Math.max(0, Number(params.page ?? 0));
  const { rows, total } = await getTransactions({
    page,
    ...(params.type ? { type: params.type } : {}),
    ...(params.status ? { status: params.status } : {})
  });

  return (
    <div>
      <PageHeader
        title="Transactions"
        description={`${total} total — full cross-user ledger`}
      />

      <div className="rounded-lg border border-border-default bg-surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border-hairline">
                {["User", "Type", "Asset", "Amount", "Status", "Reference", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-medium text-text-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">No transactions found.</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-1/30">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/users/${row.profile_id}`} className="text-accent-primary hover:brightness-110">
                        {row.user_email ?? row.profile_id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 capitalize text-text-secondary">{row.type}</td>
                    <td className="px-4 py-3 font-mono text-text-muted">{row.asset ?? "—"}</td>
                    <td className="px-4 py-3 font-mono font-medium text-text-primary">
                      {formatAmount(row.amount, row.asset)}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-3 font-mono text-text-muted text-[11px] max-w-[140px] truncate">
                      {row.reference ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-text-muted text-[11px] whitespace-nowrap">
                      {formatDate(row.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <PaginationRow page={page} total={total} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
