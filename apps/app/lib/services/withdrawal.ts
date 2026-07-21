export type WithdrawalStatus = "draft" | "pending_review" | "approved" | "processing" | "completed" | "rejected" | "failed" | "cancelled";

export interface WithdrawalEligibility {
  readonly eligible: boolean;
  readonly reason?: string;
  readonly availableBalance: number;
  readonly currency: string;
}

export interface WithdrawalRequest {
  readonly walletId: string;
  readonly profileId: string;
  readonly asset: string;
  readonly network: string;
  readonly amount: number;
  readonly destination: string;
  readonly note?: string;
}

export interface WithdrawalRecord {
  readonly id: string;
  readonly asset: string;
  readonly network: string;
  readonly amount: number;
  readonly destination: string;
  readonly status: WithdrawalStatus;
  readonly reference: string | null;
  readonly createdAt: string;
}

export interface WithdrawalService {
  getEligibility(walletId: string): Promise<WithdrawalEligibility>;
  createWithdrawalRequest(request: WithdrawalRequest): Promise<WithdrawalRecord>;
  getWithdrawals(walletId: string): Promise<readonly WithdrawalRecord[]>;
  cancelWithdrawal(withdrawalId: string): Promise<void>;
}
