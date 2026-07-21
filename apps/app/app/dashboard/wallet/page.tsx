import { Wallet as WalletIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState, StatCard } from "@netlium/ui";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { InternalLedgerCustodyProvider } from "@netlium/lib";
import { requireProvisionedUser } from "@/lib/auth";
import { DepositAddressList } from "./DepositAddressList";
import { GenerateAddressButton, type AssetNetworkPair } from "./GenerateAddressButton";
import { WithdrawalForm } from "./WithdrawalForm";
import { TransactionList } from "./TransactionList";

export default async function WalletPage() {
  const { profile } = await requireProvisionedUser();
  const supabase = await createSupabaseServerClient();

  const { data: wallet } = await supabase.from("wallets").select("id").eq("profile_id", profile.id).maybeSingle();

  if (!wallet) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <div>
          <h1 className="text-[1.35rem] font-semibold leading-tight tracking-tight text-text-primary sm:text-2xl">Neptlium Wallet</h1>
        </div>
        <Card>
          <EmptyState
            icon={<WalletIcon className="size-5" aria-hidden="true" />}
            title="Wallet not yet provisioned"
            description="Complete account provisioning to activate your wallet."
          />
        </Card>
      </div>
    );
  }

  const provider = new InternalLedgerCustodyProvider(supabase);
  const [balances, addresses, transactions, assets] = await Promise.all([
    provider.getBalances(wallet.id),
    provider.listDepositAddresses(wallet.id),
    provider.listTransactions(wallet.id),
    provider.listSupportedAssets()
  ]);

  const pairs: readonly AssetNetworkPair[] = (
    await Promise.all(
      assets.map(async (asset) => {
        const networks = await provider.listSupportedNetworks(asset.code);
        return networks.map((network) => ({
          assetCode: asset.code,
          assetLabel: asset.label,
          networkCode: network.code,
          networkLabel: network.label
        }));
      })
    )
  ).flat();

  const cashBalance = balances.find((balance) => balance.asset === "USD")?.amount ?? 0;
  const pendingCount = transactions.filter((transaction) => ["pending", "pending_review", "processing"].includes(transaction.status)).length;
  const totalValue = balances.reduce((sum, balance) => sum + balance.amount, 0);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-[1.35rem] font-semibold leading-tight tracking-tight text-text-primary sm:text-2xl">Neptlium Wallet</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Institutional custody infrastructure for funding, transfers, and withdrawals
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total wallet value" value={`$${totalValue.toFixed(2)}`} />
        <StatCard label="Pending transactions" value={String(pendingCount)} />
        <StatCard label="Deposit addresses" value={String(addresses.length)} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Deposit</CardTitle>
          <GenerateAddressButton pairs={pairs} />
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <EmptyState
              icon={<WalletIcon className="size-5" aria-hidden="true" />}
              title="No provider-assigned deposit address yet"
              description="Crypto deposits are not enabled until a configured custody provider or authorized operations assignment creates an address."
            />
          ) : (
            <DepositAddressList addresses={addresses} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported assets and networks</CardTitle>
        </CardHeader>
        <CardContent>
          {pairs.length === 0 ? <p className="text-sm text-text-secondary">No provider-backed assets or networks are configured.</p> : <div className="flex flex-wrap gap-2">{pairs.map((pair) => <span key={`${pair.assetCode}-${pair.networkCode}`} className="rounded-full border border-border-default px-3 py-1 text-xs text-text-secondary">{pair.assetCode} · {pair.networkCode}</span>)}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal-address book</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No verified withdrawal addresses" description="Add and verify a withdrawal address before requesting external withdrawals." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <WithdrawalForm pairs={pairs} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <EmptyState title="No wallet transactions yet" />
          ) : (
            <TransactionList transactions={transactions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
