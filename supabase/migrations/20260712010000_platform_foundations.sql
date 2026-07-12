-- Platform foundations: normalized organization identity, portfolio/wallet
-- ledger, and security/notification event tables. Additive except for the
-- profiles.legal_name / profiles.jurisdiction columns added two migrations
-- ago — those are dropped in favor of `organizations`, which is the correct
-- home for organization identity and avoids duplicating it on `profiles` for
-- every non-individual Purpose. Safe pre-launch: no production rows exist.

-- ---------------------------------------------------------------------------
-- Identity: organizations (Family Office / Business / Investment Firm /
-- Treasury Team / Capital Partner all share this shape; Individual does not
-- get a row here — its fields live directly on profiles).
-- ---------------------------------------------------------------------------
create table if not exists "public"."organizations" (
  "id" uuid primary key default gen_random_uuid(),
  "owner_id" uuid not null references auth.users(id) on delete cascade,
  "name" text not null,
  "role" text,
  "website" text,
  "industry" text,
  "country" text,
  "organization_size" text,
  "aum_range" text,
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."organizations" enable row level security;

create policy "organizations_select_own" on "public"."organizations"
  for select using (auth.uid() = owner_id);

create policy "organizations_update_own" on "public"."organizations"
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- profiles: drop the pre-normalization organization fields, replace the
-- 4-value investor_type with the directive's 6 Purpose options, add
-- Individual-only profile fields, and link to organizations.
alter table "public"."profiles"
  drop column if exists "legal_name",
  drop column if exists "jurisdiction";

alter table "public"."profiles"
  add column if not exists "organization_id" uuid references "public"."organizations"(id),
  add column if not exists "primary_objective" text,
  add column if not exists "investment_experience" text,
  add column if not exists "preferred_currency" text,
  add column if not exists "risk_preference" text;

-- Realign any pre-existing investor_type values to the new vocabulary before
-- narrowing — this migration must not fail on data written under the old
-- purposeStepSchema.
update "public"."profiles" set "investor_type" = 'individual'
  where "investor_type" in ('advisor', 'enterprise', 'institutional');

-- ---------------------------------------------------------------------------
-- Portfolio / Wallet ledger. One portfolio and one wallet per profile today
-- (provisioned together); modeled as separate tables because Portfolio ->
-- Wallet is a real relationship the product will grow into (multiple
-- wallets per portfolio is the reason `wallets` isn't just a column).
-- Named `investment_portfolios`, not `portfolios` — that name is already
-- taken by a pre-existing, actively-used table (a different, legacy
-- DeFi-strategies feature: populated by the handle_new_user trigger and
-- foreign-keyed from holdings/strategies/yields/risk_scores/
-- rebalancing_events). This is a distinct concept and must not collide.
-- ---------------------------------------------------------------------------
create table if not exists "public"."investment_portfolios" (
  "id" uuid primary key default gen_random_uuid(),
  "profile_id" uuid not null unique references auth.users(id) on delete cascade,
  "name" text not null default 'Primary Portfolio',
  "currency" text not null default 'USD',
  "status" text not null default 'active',
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."investment_portfolios" enable row level security;

create policy "investment_portfolios_select_own" on "public"."investment_portfolios"
  for select using (auth.uid() = profile_id);

create table if not exists "public"."wallets" (
  "id" uuid primary key default gen_random_uuid(),
  "portfolio_id" uuid not null references "public"."investment_portfolios"(id) on delete cascade,
  "profile_id" uuid not null references auth.users(id) on delete cascade,
  "provider" text not null default 'internal',
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."wallets" enable row level security;

create policy "wallets_select_own" on "public"."wallets"
  for select using (auth.uid() = profile_id);

-- Append-only ledger. Balances are derived by summing this table rather than
-- maintained as a separately-mutable balance column, so a balance can never
-- drift from the transactions that produced it.
create table if not exists "public"."wallet_transactions" (
  "id" uuid primary key default gen_random_uuid(),
  "wallet_id" uuid not null references "public"."wallets"(id) on delete cascade,
  "profile_id" uuid not null references auth.users(id) on delete cascade,
  "type" text not null check ("type" in ('deposit', 'withdrawal', 'allocation', 'transfer')),
  "asset" text not null,
  "network" text not null,
  "amount" numeric not null,
  "status" text not null default 'pending' check ("status" in ('pending', 'completed', 'failed', 'cancelled')),
  "reference" text,
  "counterparty" text,
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."wallet_transactions" enable row level security;

create policy "wallet_transactions_select_own" on "public"."wallet_transactions"
  for select using (auth.uid() = profile_id);

create policy "wallet_transactions_insert_own" on "public"."wallet_transactions"
  for insert with check (auth.uid() = profile_id);

-- Deposit "addresses" under the internal custody provider are funding
-- references (e.g. a wire reference code), not blockchain addresses — see
-- packages/lib/src/custody. The `provider` column is what lets a future real
-- custody integration coexist with, and eventually replace, this table's
-- rows without any UI change.
create table if not exists "public"."custody_addresses" (
  "id" uuid primary key default gen_random_uuid(),
  "wallet_id" uuid not null references "public"."wallets"(id) on delete cascade,
  "profile_id" uuid not null references auth.users(id) on delete cascade,
  "provider" text not null default 'internal',
  "asset" text not null,
  "network" text not null,
  "address" text not null,
  "status" text not null default 'active' check ("status" in ('active', 'retired')),
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."custody_addresses" enable row level security;

create policy "custody_addresses_select_own" on "public"."custody_addresses"
  for select using (auth.uid() = profile_id);

create policy "custody_addresses_insert_own" on "public"."custody_addresses"
  for insert with check (auth.uid() = profile_id);

-- ---------------------------------------------------------------------------
-- Security events + notifications
-- ---------------------------------------------------------------------------
create table if not exists "public"."login_history" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references auth.users(id) on delete cascade,
  "event_type" text not null check ("event_type" in (
    'login', 'logout', 'signup', 'password_reset_requested', 'password_updated',
    'mfa_enrolled', 'mfa_verified', 'mfa_unenrolled', 'sessions_revoked'
  )),
  "user_agent" text,
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."login_history" enable row level security;

create policy "login_history_select_own" on "public"."login_history"
  for select using (auth.uid() = user_id);

create table if not exists "public"."trusted_devices" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references auth.users(id) on delete cascade,
  "device_id" text not null,
  "user_agent" text,
  "last_seen_at" timestamp with time zone not null default now(),
  "created_at" timestamp with time zone not null default now(),
  unique ("user_id", "device_id")
);

alter table "public"."trusted_devices" enable row level security;

create policy "trusted_devices_select_own" on "public"."trusted_devices"
  for select using (auth.uid() = user_id);

create policy "trusted_devices_insert_own" on "public"."trusted_devices"
  for insert with check (auth.uid() = user_id);

create policy "trusted_devices_update_own" on "public"."trusted_devices"
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists "public"."notifications" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" uuid not null references auth.users(id) on delete cascade,
  "category" text not null check ("category" in (
    'security', 'deposit', 'withdrawal', 'allocation', 'document', 'system'
  )),
  "title" text not null,
  "body" text,
  "read_at" timestamp with time zone,
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."notifications" enable row level security;

create policy "notifications_select_own" on "public"."notifications"
  for select using (auth.uid() = user_id);

create policy "notifications_insert_own" on "public"."notifications"
  for insert with check (auth.uid() = user_id);

create policy "notifications_update_own" on "public"."notifications"
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
