"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@netlium/lib/supabase/server";
import { InternalLedgerCustodyProvider, createNotification } from "@netlium/lib";
import { requireProvisionedUser } from "@/lib/auth";

export type AllocationRequestResult = { readonly ok: true } | { readonly ok: false; readonly error: string };

export async function requestCapitalAllocationAction(_prevState: AllocationRequestResult | null, formData: FormData): Promise<AllocationRequestResult> {
  const { user, profile } = await requireProvisionedUser();
  const supabase = await createSupabaseServerClient();
  const walletId = String(formData.get("walletId") ?? "");
  const portfolioId = String(formData.get("portfolioId") ?? "");
  const asset = String(formData.get("asset") ?? "");
  const network = String(formData.get("network") ?? "");
  const amount = Number(formData.get("amount"));
  const idempotencyKey = String(formData.get("idempotencyKey") ?? globalThis.crypto.randomUUID());

  if (!walletId || !portfolioId || !asset || !network || !Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Choose a wallet, portfolio, asset/network, and positive amount." };
  }

  const [{ data: wallet }, { data: portfolio }] = await Promise.all([
    supabase.from("wallets").select("id").eq("id", walletId).eq("profile_id", profile.id).maybeSingle(),
    supabase.from("investment_portfolios").select("id").eq("id", portfolioId).eq("profile_id", profile.id).maybeSingle()
  ]);

  if (!wallet || !portfolio) return { ok: false, error: "Wallet or portfolio is not available for this account." };
  if (profile.complianceStatus !== "active") return { ok: false, error: "Complete account verification before allocating capital." };

  const provider = new InternalLedgerCustodyProvider(supabase);
  const balances = await provider.getBalances(wallet.id);
  const available = balances.find((balance) => balance.asset === asset && balance.network === network)?.amount ?? 0;
  if (amount > available) return { ok: false, error: `Insufficient available balance. Available: ${available.toFixed(2)} ${asset}.` };

  const { error } = await supabase.from("capital_allocation_requests").insert({
    profile_id: profile.id,
    wallet_id: wallet.id,
    portfolio_id: portfolio.id,
    asset,
    network,
    amount,
    status: "pending_review",
    idempotency_key: idempotencyKey
  });

  if (error) return { ok: false, error: "Unable to submit allocation request." };

  await createNotification(supabase, user.id, "allocation", "Allocation requested", `${amount.toFixed(2)} ${asset} allocation is pending review.`);
  revalidatePath("/dashboard/allocations");
  revalidatePath("/dashboard");
  return { ok: true };
}
