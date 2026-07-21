import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CustodyAddress,
  CustodyAsset,
  CustodyBalance,
  CustodyNetwork,
  CustodyProvider,
  CustodyTransaction,
  ProvisionDepositAddressParams,
  RequestWithdrawalParams
} from "./types";

interface WalletTransactionRow {
  readonly id: string;
  readonly type: CustodyTransaction["type"];
  readonly asset: string;
  readonly network: string;
  readonly amount: number | string;
  readonly status: CustodyTransaction["status"];
  readonly reference: string | null;
  readonly counterparty: string | null;
  readonly memo?: string | null;
  readonly destination_tag?: string | null;
  readonly verification_state?: string | null;
  readonly minimum_deposit?: number | string | null;
  readonly required_confirmations?: number | null;
  readonly created_at: string;
}

interface CustodyAddressRow {
  readonly id: string;
  readonly asset: string;
  readonly network: string;
  readonly address: string;
  readonly status: CustodyAddress["status"];
  readonly memo?: string | null;
  readonly destination_tag?: string | null;
  readonly verification_state?: string | null;
  readonly minimum_deposit?: number | string | null;
  readonly required_confirmations?: number | null;
  readonly created_at: string;
}

function toTransaction(row: WalletTransactionRow): CustodyTransaction {
  return {
    id: row.id,
    type: row.type,
    asset: row.asset,
    network: row.network,
    amount: Number(row.amount),
    status: row.status,
    reference: row.reference,
    counterparty: row.counterparty,
    createdAt: row.created_at
  };
}

function toAddress(row: CustodyAddressRow): CustodyAddress {
  return {
    id: row.id,
    asset: row.asset,
    network: row.network,
    address: row.address,
    status: row.status,
    memo: row.memo ?? null,
    destinationTag: row.destination_tag ?? null,
    verificationState: row.verification_state ?? null,
    minimumDeposit: row.minimum_deposit == null ? null : Number(row.minimum_deposit),
    requiredConfirmations: row.required_confirmations ?? null,
    createdAt: row.created_at
  };
}

/**
 * The only CustodyProvider implementation today. It is a real, persisted
 * ledger every balance is derived from committed rows in
 * wallet_transactions, never hardcoded but it has no connection to any
 * actual payment rail or blockchain. Deposit addresses must come from a configured provider or authorized
 * operations assignment; this provider will not fabricate blockchain
 * destinations. Funding and withdrawals are recorded as pending and must be reconciled by
 * operations staff against the institution's actual bank activity today.
 * That reconciliation step is exactly what a future real custody/payments
 * integration would automate this class is what gets replaced then.
 */
export class InternalLedgerCustodyProvider implements CustodyProvider {
  readonly id = "internal";

  constructor(private readonly supabase: SupabaseClient) {}

  async listSupportedAssets(): Promise<readonly CustodyAsset[]> {
    return [{ code: "USD", label: "US Dollar" }];
  }

  async listSupportedNetworks(asset: string): Promise<readonly CustodyNetwork[]> {
    if (asset !== "USD") return [];
    return [{ code: "WIRE", label: "Domestic Wire" }];
  }

  async getBalances(walletId: string): Promise<readonly CustodyBalance[]> {
    const { data, error } = await this.supabase
      .from("wallet_transactions")
      .select("asset, network, amount, type, status")
      .eq("wallet_id", walletId)
      .eq("status", "completed")
      .in("type", ["deposit", "withdrawal"]);

    if (error) throw error;

    const totals = new Map<string, CustodyBalance>();
    for (const row of (data ?? []) as WalletTransactionRow[]) {
      const key = row.asset + "::" + row.network;
      const sign = row.type === "withdrawal" ? -1 : 1;
      const existing = totals.get(key);
      totals.set(key, {
        asset: row.asset,
        network: row.network,
        amount: (existing?.amount ?? 0) + sign * Number(row.amount)
      });
    }

    return [...totals.values()];
  }

  async listTransactions(walletId: string): Promise<readonly CustodyTransaction[]> {
    const { data, error } = await this.supabase
      .from("wallet_transactions")
      .select("id, type, asset, network, amount, status, reference, counterparty, created_at")
      .eq("wallet_id", walletId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ((data ?? []) as WalletTransactionRow[]).map(toTransaction);
  }

  async listDepositAddresses(walletId: string): Promise<readonly CustodyAddress[]> {
    const { data, error } = await this.supabase
      .from("custody_addresses")
      .select("id, asset, network, address, status, memo, destination_tag, verification_state, minimum_deposit, required_confirmations, created_at")
      .eq("wallet_id", walletId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ((data ?? []) as CustodyAddressRow[]).map(toAddress);
  }

  async provisionDepositAddress(params: ProvisionDepositAddressParams): Promise<CustodyAddress> {
    const { data: existing, error: existingError } = await this.supabase
      .from("custody_addresses")
      .select("id, asset, network, address, status, memo, destination_tag, verification_state, minimum_deposit, required_confirmations, created_at")
      .eq("wallet_id", params.walletId)
      .eq("profile_id", params.profileId)
      .eq("asset", params.asset)
      .eq("network", params.network)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existing) return toAddress(existing as CustodyAddressRow);

    throw new Error("Deposit address provisioning requires a configured custody provider or authorized operations assignment.");
  }

  async requestWithdrawal(params: RequestWithdrawalParams): Promise<CustodyTransaction> {
    const { data, error } = await this.supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: params.walletId,
        profile_id: params.profileId,
        type: "withdrawal",
        asset: params.asset,
        network: params.network,
        amount: params.amount,
        status: "pending_review",
        counterparty: params.destination,
        gross_amount: params.amount,
        fee_amount: 0,
        net_amount: params.amount,
        source_wallet_id: params.walletId,
        idempotency_key: params.idempotencyKey
      })
      .select("id, type, asset, network, amount, status, reference, counterparty, created_at")
      .single();

    if (error) throw error;
    return toTransaction(data as WalletTransactionRow);
  }
}
