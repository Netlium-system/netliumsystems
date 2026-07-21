/**
 * Central capability system for Neptlium customer application.
 *
 * Each capability has a status that drives UI behavior.
 * Never scatter provider/config checks across components — check here instead.
 *
 * Production defaults: capabilities are unavailable unless the backend
 * explicitly confirms they are enabled. Never silently fall back to fake data.
 */

export type CapabilityStatus =
  | "enabled"
  | "disabled"
  | "restricted"
  | "coming_soon"
  | "pending_configuration";

export interface Capability {
  readonly status: CapabilityStatus;
  readonly label: string;
  readonly description?: string;
}

export type CapabilityKey =
  | "walletProvisioning"
  | "wireDeposits"
  | "cryptoDeposits"
  | "achDeposits"
  | "depositAddresses"
  | "internalTransfers"
  | "withdrawals"
  | "portfolioCreation"
  | "capitalAllocation"
  | "documentUpload"
  | "reports"
  | "counterparties"
  | "notifications"
  | "sessionManagement";

/**
 * Production capability map.
 * Update this when backend capabilities are confirmed available.
 */
export const CAPABILITIES: Record<CapabilityKey, Capability> = {
  walletProvisioning: {
    status: "enabled",
    label: "Wallet provisioning",
    description: "Wallet accounts can be created and activated.",
  },
  wireDeposits: {
    status: "enabled",
    label: "USD wire deposits",
    description: "Domestic wire transfers to your Neptlium wallet are supported.",
  },
  cryptoDeposits: {
    status: "coming_soon",
    label: "Crypto deposits",
    description: "Cryptocurrency deposits are not yet available.",
  },
  achDeposits: {
    status: "coming_soon",
    label: "ACH / bank transfers",
    description: "ACH and bank transfer deposits are not yet available.",
  },
  depositAddresses: {
    status: "enabled",
    label: "Deposit references",
    description: "Wire funding references can be generated for your wallet.",
  },
  internalTransfers: {
    status: "coming_soon",
    label: "Internal transfers",
    description: "Alias-based transfers between Neptlium accounts are not yet available.",
  },
  withdrawals: {
    status: "enabled",
    label: "Withdrawals",
    description: "USD wire withdrawal requests can be submitted.",
  },
  portfolioCreation: {
    status: "pending_configuration",
    label: "Portfolio creation",
    description: "Portfolio configuration requires operator setup.",
  },
  capitalAllocation: {
    status: "enabled",
    label: "Capital allocation",
    description: "Capital allocation requests can be submitted.",
  },
  documentUpload: {
    status: "enabled",
    label: "Document management",
    description: "Documents can be uploaded and managed.",
  },
  reports: {
    status: "pending_configuration",
    label: "Reports",
    description: "Reports require analyst access and data availability.",
  },
  counterparties: {
    status: "coming_soon",
    label: "Counterparties",
    description: "Counterparty management is not yet available.",
  },
  notifications: {
    status: "enabled",
    label: "Notifications",
    description: "In-app notifications are available.",
  },
  sessionManagement: {
    status: "enabled",
    label: "Session management",
    description: "Active sessions can be reviewed and revoked.",
  },
};

export function getCapability(key: CapabilityKey): Capability {
  return CAPABILITIES[key];
}

export function isEnabled(key: CapabilityKey): boolean {
  return CAPABILITIES[key].status === "enabled";
}

export function getCapabilityStatusLabel(status: CapabilityStatus): string {
  switch (status) {
    case "enabled": return "Available";
    case "disabled": return "Disabled";
    case "restricted": return "Restricted";
    case "coming_soon": return "Coming soon";
    case "pending_configuration": return "Pending configuration";
  }
}
