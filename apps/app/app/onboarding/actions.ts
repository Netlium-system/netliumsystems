"use server";

import { createSupabaseAdminClient } from "@netlium/lib/supabase/admin";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { isOrganizationPurpose, provisioningPayloadSchema, type ProvisioningPayload } from "@netlium/lib";
import { requireUser } from "@/lib/auth";

export type ProvisioningResult = { readonly ok: true } | { readonly ok: false; readonly error: string };

/**
 * Finalizes account opening: assigns the default role, persists the
 * collected profile (branching into `organizations` for every non-individual
 * Purpose, so that identity isn't duplicated across profile rows), then
 * provisions the portfolio and wallet the Provisioning step's copy already
 * promises exist. Role assignment happens first — provisioned_at only
 * becomes non-null once a role exists, since supabase-js has no cross-table
 * transaction primitive and a completed provisioning state should never
 * imply a missing role.
 */
export async function submitProvisioning(input: ProvisioningPayload): Promise<ProvisioningResult> {
  const user = await requireUser();

  const parsed = provisioningPayloadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Some information from a previous step is missing or invalid." };
  }

  const data = parsed.data;
  const admin = createSupabaseAdminClient();

  const { data: existingRole } = await admin
    .from("user_roles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingRole) {
    const { error: roleError } = await admin.from("user_roles").insert({ user_id: user.id, role: "user" });
    if (roleError) {
      return { ok: false, error: "Unable to provision account access. Please try again." };
    }
  }

  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();

  let organizationId: string | null = null;
  if (isOrganizationPurpose(data.investorType)) {
    const { data: organization, error: organizationError } = await supabase
      .from("organizations")
      .insert({
        owner_id: user.id,
        name: data.companyName,
        role: data.role,
        website: data.website || null,
        industry: data.industry,
        country: data.country,
        organization_size: data.organizationSize,
        aum_range: data.aumRange || null
      })
      .select("id")
      .single();

    if (organizationError || !organization) {
      return { ok: false, error: "Unable to save your organization profile. Please try again." };
    }
    organizationId = organization.id;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      full_name: `${data.firstName} ${data.lastName}`.trim(),
      country: data.residenceCountry,
      investor_type: data.investorType,
      purpose: data.purpose,
      organization_id: organizationId,
      primary_objective: data.primaryObjective ?? null,
      investment_experience: data.investmentExperience ?? null,
      preferred_currency: data.preferredCurrency ?? null,
      risk_preference: data.riskPreference ?? null,
      compliance_status: "active",
      compliance_acknowledged_at: now,
      provisioned_at: now
    })
    .eq("id", user.id);

  if (profileError) {
    return { ok: false, error: "Unable to finalize your account. Please try again." };
  }

  const { data: existingPortfolio } = await admin
    .from("investment_portfolios")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  const portfolioId =
    existingPortfolio?.id ??
    (
      await admin
        .from("investment_portfolios")
        .insert({ profile_id: user.id })
        .select("id")
        .single()
    ).data?.id;

  if (!portfolioId) {
    return { ok: false, error: "Unable to provision your portfolio. Please try again." };
  }

  const { data: existingWallet } = await admin.from("wallets").select("id").eq("profile_id", user.id).maybeSingle();

  if (!existingWallet) {
    const { error: walletError } = await admin
      .from("wallets")
      .insert({ portfolio_id: portfolioId, profile_id: user.id, provider: "internal" });

    if (walletError) {
      return { ok: false, error: "Unable to provision your wallet. Please try again." };
    }
  }

  return { ok: true };
}
