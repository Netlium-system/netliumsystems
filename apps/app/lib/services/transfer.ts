/**
 * Internal Neptlium alias transfer service contract.
 * Status: NOT YET AVAILABLE — no alias system exists in the backend.
 * Build UI against this contract; render unavailable state in production.
 */
export type TransferStatus = "pending" | "completed" | "failed" | "cancelled";

export interface AliasResolution {
  readonly found: boolean;
  readonly alias?: string;
  readonly accountType?: string;
  readonly verified?: boolean;
  readonly selfTransfer?: boolean;
}

export interface TransferRequest {
  readonly fromWalletId: string;
  readonly toAlias: string;
  readonly asset: string;
  readonly amount: number;
  readonly note?: string;
}

export interface TransferRecord {
  readonly id: string;
  readonly toAlias: string;
  readonly asset: string;
  readonly amount: number;
  readonly status: TransferStatus;
  readonly createdAt: string;
}

export interface TransferService {
  resolveAlias(alias: string): Promise<AliasResolution>;
  createTransfer(request: TransferRequest): Promise<TransferRecord>;
  getTransfers(walletId: string): Promise<readonly TransferRecord[]>;
}
