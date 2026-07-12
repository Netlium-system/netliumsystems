import { Card, CardContent, CardHeader, CardTitle, StatCard } from "@netlium/ui";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { InternalLedgerCustodyProvider } from "@netlium/lib";
import { getCurrentProfile } from "@/lib/auth";
import { PortfolioGreeting } from "./PortfolioGreeting";

export default async function PortfolioPage() {
  const profile = await getCurrentProfile();
  const name = profile?.fullName || profile?.displayName || null;

  const supabase = await createSupabaseServerClient();

  const { data: portfolio } = profile
    ? await supabase
        .from("investment_portfolios")
        .select("id, name, currency, status")
        .eq("profile_id", profile.id)
        .maybeSingle()
    : { data: null };

  const { data: wallet } = profile
    ? await supabase.from("wallets").select("id").eq("profile_id", profile.id).maybeSingle()
    : { data: null };

  let totalValue = 0;
  let activeHoldings = 0;

  if (wallet) {
    const provider = new InternalLedgerCustodyProvider(supabase);
    const balances = await provider.getBalances(wallet.id);
    totalValue = balances.reduce((sum, balance) => sum + balance.amount, 0);
    activeHoldings = balances.filter((balance) => balance.amount > 0).length;
  }

  return (
    <div className="space-y-8 py-8">
      <PortfolioGreeting name={name} complianceActive={profile?.complianceStatus === "active"} />

      {portfolio && (
        <Card>
          <CardHeader>
            <CardTitle>{portfolio.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-body-sm text-text-secondary">{portfolio.currency}</p>
            <p className="text-body-sm font-medium capitalize text-text-primary">{portfolio.status}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <StatCard label="Total Portfolio Value" value={`$${totalValue.toFixed(2)}`} />
        <StatCard label="Active Holdings" value={String(activeHoldings)} />
      </div>
    </div>
  );
}
