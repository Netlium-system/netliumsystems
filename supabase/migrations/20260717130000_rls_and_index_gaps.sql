-- =============================================================================
-- Fix RLS gaps and missing FK indexes
-- =============================================================================

-- -----------------------------------------------------------------------------
-- account_balances
-- Only the owning user should read their own balance rows.
-- Writes are done exclusively via the credit_balance() SECURITY DEFINER fn
-- (service_role), so no INSERT/UPDATE policy is needed for regular users.
-- -----------------------------------------------------------------------------
create policy "account_balances_select_own"
  on public.account_balances
  for select
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- assets
-- Public read-only reference table. No user writes — inserts/updates are
-- done by platform operators via service_role only.
-- -----------------------------------------------------------------------------
create policy "assets_select_all"
  on public.assets
  for select
  using (true);

-- -----------------------------------------------------------------------------
-- crypto_deposit_events
-- Written exclusively by confirm_crypto_deposit() (service_role).
-- Users may only read their own events.
-- -----------------------------------------------------------------------------
create policy "crypto_deposit_events_select_own"
  on public.crypto_deposit_events
  for select
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- deposit_addresses
-- Written exclusively by admin_add_deposit_address() (service_role).
-- Regular users have no business reading the address pool — reads go through
-- the platform's assign-address flow (service_role).
-- Block all direct access.
-- -----------------------------------------------------------------------------
create policy "deposit_addresses_no_direct_access"
  on public.deposit_addresses
  for select
  using (false);

-- -----------------------------------------------------------------------------
-- deposits
-- Legacy table (superseded by payment_intents + crypto_deposit_events).
-- Lock down: service_role only.
-- -----------------------------------------------------------------------------
create policy "deposits_no_direct_access"
  on public.deposits
  for select
  using (false);

-- -----------------------------------------------------------------------------
-- platform_deposit_addresses
-- Internal platform config (hot-wallet addresses). No user access.
-- -----------------------------------------------------------------------------
create policy "platform_deposit_addresses_no_direct_access"
  on public.platform_deposit_addresses
  for select
  using (false);

-- =============================================================================
-- Missing FK indexes
-- =============================================================================

-- crypto_deposit_events
create index if not exists idx_crypto_deposit_events_user_id
  on public.crypto_deposit_events (user_id);

create index if not exists idx_crypto_deposit_events_payment_intent_id
  on public.crypto_deposit_events (payment_intent_id);

-- deposit_addresses
create index if not exists idx_deposit_addresses_user_id
  on public.deposit_addresses (user_id);

-- deposits
create index if not exists idx_deposits_user_id
  on public.deposits (user_id);

-- ledger_entries
create index if not exists idx_ledger_entries_user_id
  on public.ledger_entries (user_id);

-- rebalancing_events
create index if not exists idx_rebalancing_events_executed_by
  on public.rebalancing_events (executed_by);

-- user_deposit_intents
create index if not exists idx_user_deposit_intents_user_id
  on public.user_deposit_intents (user_id);

-- user_roles
create index if not exists idx_user_roles_user_id
  on public.user_roles (user_id);

-- withdrawal_requests
create index if not exists idx_withdrawal_requests_user_id
  on public.withdrawal_requests (user_id);

create index if not exists idx_withdrawal_requests_reviewed_by
  on public.withdrawal_requests (reviewed_by);

-- organizations
create index if not exists idx_organizations_owner_id
  on public.organizations (owner_id);

-- investment_portfolios
create index if not exists idx_investment_portfolios_profile_id
  on public.investment_portfolios (profile_id);

-- wallets
create index if not exists idx_wallets_portfolio_id
  on public.wallets (portfolio_id);

create index if not exists idx_wallets_profile_id
  on public.wallets (profile_id);

-- wallet_transactions
create index if not exists idx_wallet_transactions_wallet_id
  on public.wallet_transactions (wallet_id);

create index if not exists idx_wallet_transactions_profile_id
  on public.wallet_transactions (profile_id);

-- custody_addresses
create index if not exists idx_custody_addresses_wallet_id
  on public.custody_addresses (wallet_id);

create index if not exists idx_custody_addresses_profile_id
  on public.custody_addresses (profile_id);

-- login_history
create index if not exists idx_login_history_user_id
  on public.login_history (user_id);

-- trusted_devices
create index if not exists idx_trusted_devices_user_id
  on public.trusted_devices (user_id);

-- notifications
create index if not exists idx_notifications_user_id
  on public.notifications (user_id);

-- documents
create index if not exists idx_documents_profile_id
  on public.documents (profile_id);
