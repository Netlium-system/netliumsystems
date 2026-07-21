import { ArrowLeftRight, FileText, Wallet as WalletIcon } from "lucide-react";
import { Badge, EmptyState, StatCard } from "@netlium/ui";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { InternalLedgerCustodyProvider } from "@netlium/lib";
import { requireProvisionedUser } from "@/lib/auth";
import { DashboardSection, MetricRow, PageHeader, QuickAction } from "./components";

function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

export default async function DashboardIndexPage() {
  const { user, profile } = await requireProvisionedUser();
  const supabase = await createSupabaseServerClient();
  const provider = new InternalLedgerCustodyProvider(supabase);
  const [{ data: portfolio }, { data: wallet }, { data: documents }, { data: notifications }] = await Promise.all([
    supabase.from("investment_portfolios").select("id, name, currency, status").eq("profile_id", profile.id).maybeSingle(),
    supabase.from("wallets").select("id").eq("profile_id", profile.id).maybeSingle(),
    supabase.from("documents").select("id, created_at").eq("profile_id", profile.id).order("created_at", { ascending: false }).limit(3),
    supabase.from("notifications").select("id, read_at, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(4)
  ]);
  const [balances, transactions, addresses] = wallet ? await Promise.all([provider.getBalances(wallet.id), provider.listTransactions(wallet.id), provider.listDepositAddresses(wallet.id)]) : ([[], [], []] as const);
  const cashBalance = balances.find((balance) => balance.asset === "USD")?.amount ?? 0;
  const totalCapital = balances.reduce((sum, balance) => sum + balance.amount, 0);
  const pendingTransactions = transactions.filter((transaction) => ["pending", "pending_review", "processing"].includes(transaction.status)).length;
  const completedTransactions = transactions.filter((transaction) => transaction.status === "completed").length;
  const displayName = profile.fullName ?? profile.displayName ?? user.email ?? "there";
  const complianceStatus = profile.complianceStatus ?? "pending";

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader eyebrow="Institutional dashboard" title={`Good day, ${displayName}`} description="A concise view of your authenticated Neptlium account, capital activity, and operational readiness." actions={<Badge tone={complianceStatus === "active" ? "success" : "warning"}>{complianceStatus === "active" ? "Verified" : "Verification pending"}</Badge>} />
      <section aria-label="Account metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total capital" value={money(totalCapital, portfolio?.currency ?? "USD")} delta={portfolio ? portfolio.name : "No portfolio yet"} />
        <StatCard label="Available balance" value={money(cashBalance)} delta={wallet ? "Wallet ledger" : "Wallet not provisioned"} />
        <StatCard label="Pending activity" value={String(pendingTransactions)} delta={`${completedTransactions} completed`} />
        <StatCard label="Deposit references" value={String(addresses.length)} delta={addresses.length ? "Provider assigned" : "None assigned"} />
      </section>
      <div className="grid gap-4 xl:grid-cols-12">
        <DashboardSection title="Portfolio performance" description="Performance appears after completed ledger activity and portfolio records are available." className="xl:col-span-7">{portfolio ? <div className="space-y-1"><MetricRow label="Portfolio" value={portfolio.name} /><MetricRow label="Currency" value={portfolio.currency} /><MetricRow label="Status" value={portfolio.status} /><MetricRow label="Ledger-backed value" value={money(totalCapital, portfolio.currency)} /></div> : <EmptyState title="No portfolio has been created yet" description="Add a portfolio to begin tracking allocated capital." />}</DashboardSection>
        <DashboardSection title="Asset allocation" description="Allocation is derived from completed wallet balances." className="xl:col-span-5">{balances.length ? <div className="space-y-3">{balances.map((balance) => { const percent = totalCapital > 0 ? Math.max(0, (balance.amount / totalCapital) * 100) : 0; return <div key={`${balance.asset}-${balance.network}`}><div className="mb-2 flex items-center justify-between text-sm"><span className="text-text-secondary">{balance.asset} · {balance.network}</span><span className="font-mono text-text-primary">{percent.toFixed(1)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-surface-3"><div className="h-full rounded-full bg-accent-primary" style={{ width: `${percent}%` }} /></div></div>; })}</div> : <EmptyState title="No capital has been allocated" description="Completed deposits will define your allocation view." />}</DashboardSection>
        <DashboardSection title="Recent activity" className="xl:col-span-5">{transactions.length ? <div className="space-y-1">{transactions.slice(0, 5).map((transaction) => <MetricRow key={transaction.id} label={`${transaction.type} · ${transaction.asset}`} value={`${transaction.type === "withdrawal" ? "−" : "+"}${money(transaction.amount)}`} tone={transaction.status === "pending" ? "warning" : "default"} />)}</div> : <EmptyState title="No wallet activity yet" description="Deposits and withdrawals will appear here when recorded." />}</DashboardSection>
        <DashboardSection title="Wallet summary" className="xl:col-span-4"><div className="space-y-1"><MetricRow label="Wallet" value={wallet ? "Provisioned" : "Not provisioned"} tone={wallet ? "success" : "warning"} /><MetricRow label="Cash balance" value={money(cashBalance)} /><MetricRow label="Deposit addresses" value={String(addresses.length)} /><MetricRow label="Documents" value={String(documents?.length ?? 0)} /></div></DashboardSection>
        <DashboardSection title="Quick actions" className="xl:col-span-3"><div className="grid gap-2"><QuickAction href="/dashboard/wallet" label="Fund wallet" description="Use provider-assigned destinations" icon={<WalletIcon />} /><QuickAction href="/dashboard/transactions" label="Review activity" description="Audit ledger movements" icon={<ArrowLeftRight />} /><QuickAction href="/dashboard/documents" label="Documents" description="View issued files" icon={<FileText />} /></div></DashboardSection>
      </div>
      <DashboardSection title="Account state" description="Verification and onboarding status for this authenticated profile."><div className="grid gap-3 sm:grid-cols-3"><MetricRow label="Compliance" value={complianceStatus} tone={complianceStatus === "active" ? "success" : "warning"} /><MetricRow label="Provisioned" value={profile.provisionedAt ? "Complete" : "Incomplete"} tone={profile.provisionedAt ? "success" : "warning"} /><MetricRow label="Unread notifications" value={String((notifications ?? []).filter((item) => !item.read_at).length)} /></div></DashboardSection>
    </div>
  );
}
