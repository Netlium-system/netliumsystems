export type AllocationStatus = "pending_review" | "approved" | "executed" | "rejected" | "cancelled";

export interface AllocationEligibility {
  readonly eligible: boolean;
  readonly reason?: string;
  readonly walletId: string | null;
  readonly portfolioCount: number;
}

export interface AllocationRequest {
  readonly walletId: string;
  readonly portfolioId: string;
  readonly asset: string;
  readonly network: string;
  readonly amount: number;
  readonly notes?: string;
}

export interface AllocationRecord {
  readonly id: string;
  readonly asset: string;
  readonly network: string;
  readonly amount: number;
  readonly status: AllocationStatus;
  readonly notes: string | null;
  readonly createdAt: string;
}

export interface AllocationService {
  getEligibility(profileId: string): Promise<AllocationEligibility>;
  createAllocationRequest(request: AllocationRequest): Promise<AllocationRecord>;
  getAllocations(profileId: string): Promise<readonly AllocationRecord[]>;
  cancelAllocation(allocationId: string): Promise<void>;
}
