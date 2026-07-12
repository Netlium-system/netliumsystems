export interface CustodyAsset {
  readonly code: string;
  readonly label: string;
}

export interface CustodyNetwork {
  readonly code: string;
  readonly label: string;
}

export type CustodyAddressStatus = "active" | "retired";

export interface CustodyAddress {
  readonly id: string;
  readonly asset: string;
  readonly network: string;
  readonly address: string;
  readonly status: CustodyAddressStatus;
  readonly createdAt: string;
}

export interface CustodyBalance {
  readonly asset: string;
  readonly network: string;
  readonly amount: number;
}

export type CustodyTransactionType = "deposit" | "withdrawal" | "allocation" | "transfer";
export type CustodyTransactionStatus = "pending" | "completed" | "failed" | "cancelled";

export interface CustodyTransaction {
  readonly id: string;
  readonly type: CustodyTransactionType;
  readonly asset: string;
  readonly network: string;
  readonly amount: number;
  readonly status: CustodyTransactionStatus;
  readonly reference: string | null;
  readonly counterparty: string | null;
  readonly createdAt: string;
}

export interface ProvisionDepositAddressParams {
  readonly walletId: string;
  readonly profileId: string;
  readonly asset: string;
  readonly network: string;
}

export interface RequestWithdrawalParams {
  readonly walletId: string;
  readonly profileId: string;
  readonly asset: string;
  readonly network: string;
  readonly amount: number;
  readonly destination: string;
}

/**
 * Custody abstraction — every wallet feature in the app is written against
 * this interface, never against a specific provider. `InternalLedgerCustodyProvider`
 * is the only implementation today (a real, DB-backed ledger; no external
 * custody integration exists yet). Swapping in a real custodian later means
 * writing a new class that satisfies this interface — no UI or Server Action
 * changes required.
 */
export interface CustodyProvider {
  readonly id: string;
  listSupportedAssets(): Promise<readonly CustodyAsset[]>;
  listSupportedNetworks(asset: string): Promise<readonly CustodyNetwork[]>;
  getBalances(walletId: string): Promise<readonly CustodyBalance[]>;
  listTransactions(walletId: string): Promise<readonly CustodyTransaction[]>;
  listDepositAddresses(walletId: string): Promise<readonly CustodyAddress[]>;
  provisionDepositAddress(params: ProvisionDepositAddressParams): Promise<CustodyAddress>;
  requestWithdrawal(params: RequestWithdrawalParams): Promise<CustodyTransaction>;
}
