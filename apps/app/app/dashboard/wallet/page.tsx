import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { InternalLedgerCustodyProvider } from "@netlium/lib";
import { requireProvisionedUser } from "@/lib/auth";
import { WalletView } from "./WalletView";

export default async function WalletPage() {
  const { profile } = await requireProvisionedUser();
  const supabase = await createSupabaseServerClient();

  const { data: walletRow } = await supabase
    .from("wallets")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!walletRow) {
    return (
      <WalletView
        totalBalance={0}
        availableBalance={0}
        pendingBalance={0}
        pendingCount={0}
        existingAddresses={[]}
        transactions={[]}
        pairs={[]}
        hasWallet={false}
        walletId={null}
      />
    );
  }

  const provider = new InternalLedgerCustodyProvider(supabase);
  const [balances, addresses, transactions, assets] = await Promise.all([
    provider.getBalances(walletRow.id),
    provider.listDepositAddresses(walletRow.id),
    provider.listTransactions(walletRow.id),
    provider.listSupportedAssets(),
  ]);

  const pairs = (
    await Promise.all(
      assets.map(async (asset) => {
        const networks = await provider.listSupportedNetworks(asset.code);
        return networks.map((network) => ({
          assetCode: asset.code,
          assetLabel: asset.label,
          networkCode: network.code,
          networkLabel: network.label,
        }));
      })
    )
  ).flat();

  const totalBalance = balances.reduce((s, b) => s + b.amount, 0);
  const pendingTxs = transactions.filter(
    (t) => t.status === "pending" || t.status === "pending_review"
  );
  const pendingBalance = pendingTxs.reduce((s, t) => s + t.amount, 0);
  const availableBalance = totalBalance;
  const pendingCount = pendingTxs.length;

  return (
    <WalletView
      totalBalance={totalBalance}
      availableBalance={availableBalance}
      pendingBalance={pendingBalance}
      pendingCount={pendingCount}
      existingAddresses={addresses.map((a) => ({
        id: a.id,
        asset: a.asset,
        network: a.network,
        address: a.address,
        status: a.status,
        createdAt: a.createdAt,
      }))}
      transactions={transactions.map((t) => ({
        id: t.id,
        type: t.type,
        asset: t.asset,
        network: t.network,
        amount: t.amount,
        status: t.status,
        created_at: t.createdAt,
      }))}
      pairs={pairs}
      hasWallet={true}
      walletId={walletRow.id}
    />
  );
}
