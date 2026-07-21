import { SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "@netlium/ui";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { InternalLedgerCustodyProvider } from "@netlium/lib";
import { requireRole, requireProvisionedUser } from "@/lib/auth";
import { AllocationRequestForm } from "./AllocationRequestForm";

export default async function AllocationsPage() {
  await requireRole("analyst");
  const { profile } = await requireProvisionedUser();
  const supabase = await createSupabaseServerClient();
  const [{ data: wallets }, { data: portfolios }, { data: requests }] = await Promise.all([
    supabase.from("wallets").select("id").eq("profile_id", profile.id),
    supabase.from("investment_portfolios").select("id, name").eq("profile_id", profile.id),
    supabase.from("capital_allocation_requests").select("id, asset, network, amount, status, created_at").eq("profile_id", profile.id).order("created_at", { ascending: false }).limit(10)
  ]);
  const provider = new InternalLedgerCustodyProvider(supabase);
  const balances = wallets?.[0] ? await provider.getBalances(wallets[0].id) : [];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div><h1 className="text-[1.35rem] font-semibold leading-tight tracking-tight text-text-primary sm:text-2xl">Capital Allocations</h1><p className="mt-2 text-sm leading-6 text-text-secondary">Create reviewed allocation requests from real available wallet balances.</p></div>
      <Card><CardHeader><CardTitle>Request allocation</CardTitle></CardHeader><CardContent><AllocationRequestForm wallets={(wallets ?? []).map((wallet) => ({ id: wallet.id, label: "Primary wallet" }))} portfolios={(portfolios ?? []).map((portfolio) => ({ id: portfolio.id, label: portfolio.name }))} balances={balances.map((balance) => ({ asset: balance.asset, network: balance.network, amount: balance.amount }))} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Recent allocation requests</CardTitle></CardHeader><CardContent>{!requests?.length ? <EmptyState icon={<SlidersHorizontal className="size-5" aria-hidden="true" />} title="No allocations configured" description="Allocation requests will appear here after submission and review." /> : <div className="space-y-2">{requests.map((request) => <div key={request.id} className="flex min-h-11 items-center justify-between rounded-md border border-border-hairline px-3 py-2 text-sm"><span className="text-text-primary">{Number(request.amount).toFixed(2)} {request.asset} · {request.network}</span><span className="capitalize text-text-muted">{request.status}</span></div>)}</div>}</CardContent></Card>
    </div>
  );
}
