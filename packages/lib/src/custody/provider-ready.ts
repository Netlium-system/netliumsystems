import type { CustodyAddress, CustodyAsset, CustodyNetwork } from "./types";

export type DepositRail = "crypto" | "usd";

export interface DepositAddressRequest {
  readonly walletId: string;
  readonly profileId: string;
  readonly asset: string;
  readonly network: string;
  readonly idempotencyKey?: string;
}

export interface NormalizedDepositEvent {
  readonly provider: string;
  readonly providerEventId: string;
  readonly providerReference?: string;
  readonly asset: string;
  readonly network: string;
  readonly grossAmount: number;
  readonly feeAmount?: number;
  readonly netAmount: number;
  readonly status: "detected" | "confirming" | "confirmed" | "credited" | "failed" | "reversed";
  readonly observedAt: string;
  readonly safeMetadata?: Record<string, unknown>;
}

export interface DepositProviderAdapter {
  readonly id: string;
  readonly rail: DepositRail;
  isConfigured(): boolean;
  listSupportedAssets(): Promise<readonly CustodyAsset[]>;
  listSupportedNetworks(asset: string): Promise<readonly CustodyNetwork[]>;
  getOrCreateDepositAddress(params: DepositAddressRequest): Promise<CustodyAddress>;
  getDepositStatus(providerReference: string): Promise<NormalizedDepositEvent | null>;
  verifyWebhook(payload: string, signature: string | null): Promise<boolean>;
  normalizeDepositEvent(payload: unknown): Promise<NormalizedDepositEvent>;
}

export class UnconfiguredDepositProvider implements DepositProviderAdapter {
  readonly id = "unconfigured";
  readonly rail: DepositRail;

  constructor(rail: DepositRail = "crypto") {
    this.rail = rail;
  }

  isConfigured(): boolean {
    return false;
  }

  async listSupportedAssets(): Promise<readonly CustodyAsset[]> {
    return [];
  }

  async listSupportedNetworks(): Promise<readonly CustodyNetwork[]> {
    return [];
  }

  async getOrCreateDepositAddress(): Promise<CustodyAddress> {
    throw new Error(`${this.rail} deposits are not configured`);
  }

  async getDepositStatus(): Promise<NormalizedDepositEvent | null> {
    return null;
  }

  async verifyWebhook(): Promise<boolean> {
    return false;
  }

  async normalizeDepositEvent(): Promise<NormalizedDepositEvent> {
    throw new Error(`${this.rail} deposits are not configured`);
  }
}

export function createCryptoDepositProvider(): DepositProviderAdapter {
  return new UnconfiguredDepositProvider("crypto");
}

export function createUsdDepositProvider(): DepositProviderAdapter {
  return new UnconfiguredDepositProvider("usd");
}
