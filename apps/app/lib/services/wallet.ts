/**
 * Wallet service contract.
 * Production: backed by InternalLedgerCustodyProvider + Supabase.
 * Future: will be replaced by real custody integration.
 */
export type WalletStatus = "active" | "inactive" | "locked" | "closed" | "provisioning" | "not_provisioned";

export interface WalletSummary {
  readonly walletId: string;
  readonly status: WalletStatus;
  readonly totalBalance: number;
  readonly availableBalance: number;
  readonly pendingBalance: number;
  readonly currency: string;
  readonly assetCount: number;
}

export interface WalletAsset {
  readonly asset: string;
  readonly network: string;
  readonly balance: number;
}

export interface WalletService {
  getWalletSummary(profileId: string): Promise<WalletSummary | null>;
  getWalletAssets(walletId: string): Promise<readonly WalletAsset[]>;
  requestWalletProvisioning(profileId: string): Promise<void>;
}
