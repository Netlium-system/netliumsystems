import { z } from "zod";

export const investorTypes = ["individual", "business", "family_office", "treasury_team", "investment_firm"] as const;
export type InvestorType = (typeof investorTypes)[number];

export const securityOptions = ["authenticator", "email", "recovery_codes", "trusted_device"] as const;
export type SecurityOption = (typeof securityOptions)[number];

export const onboardingPayloadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(100),
  lastName: z.string().trim().min(1, "Last name is required.").max(100),
  country: z.string().trim().min(1, "Country is required.").max(100),
  phone: z.string().trim().max(50).optional(),
  timezone: z.string().trim().min(1, "Timezone is required.").max(100),
  language: z.string().trim().min(1, "Language is required.").max(100),
  investorType: z.enum(investorTypes),
  region: z.string().trim().min(1, "Region is required.").max(100),
  organizationName: z.string().trim().max(200).optional(),
  website: z.union([z.string().trim().url("Enter a valid website URL."), z.literal("")]).optional(),
  companyRole: z.string().trim().max(120).optional(),
  securityChoices: z.array(z.enum(securityOptions)),
  acceptedTerms: z.literal(true, { message: "You must accept the Terms of Service and Privacy Policy." })
});

export type ProvisioningPayload = z.infer<typeof onboardingPayloadSchema>;
