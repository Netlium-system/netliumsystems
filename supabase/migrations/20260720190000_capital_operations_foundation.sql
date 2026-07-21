-- Production capital operations foundation.
-- Non-destructive additions only: provider-ready audit/event tables, immutable
-- request records, address-book records, and metadata columns for existing
-- wallet tables. This migration does not credit balances or execute movements.

create table if not exists public.provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  status text not null default 'received',
  payload jsonb not null default '{}'::jsonb,
  safe_metadata jsonb not null default '{}'::jsonb,
  observed_at timestamptz not null default now(),
  processed_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

alter table public.provider_events enable row level security;

drop policy if exists provider_events_no_direct_access on public.provider_events;
create policy provider_events_no_direct_access on public.provider_events for all using (false) with check (false);


-- Extend existing non-enum check constraints before writing reviewed states.
alter table public.wallet_transactions drop constraint if exists wallet_transactions_status_check;
alter table public.wallet_transactions add constraint wallet_transactions_status_check check (status in ('draft','pending','pending_review','processing','completed','failed','cancelled','reversed'));

alter table public.custody_addresses drop constraint if exists custody_addresses_status_check;
alter table public.custody_addresses add constraint custody_addresses_status_check check (status in ('active','available','pending','retired'));

alter table public.custody_addresses
  add column if not exists memo text,
  add column if not exists destination_tag text,
  add column if not exists verification_state text not null default 'unverified',
  add column if not exists last_used_at timestamptz,
  add column if not exists minimum_deposit numeric,
  add column if not exists required_confirmations integer,
  add column if not exists safe_metadata jsonb not null default '{}'::jsonb;

create unique index if not exists custody_addresses_wallet_asset_network_provider_idx
  on public.custody_addresses (wallet_id, asset, network, provider);


-- Users may read wallet state through RLS, but client code must not directly
-- create ledger-affecting rows or custody destinations. Server actions and
-- provider webhooks use privileged server-side clients / controlled functions.
drop policy if exists wallet_transactions_insert_own on public.wallet_transactions;
drop policy if exists custody_addresses_insert_own on public.custody_addresses;

alter table public.wallet_transactions
  add column if not exists provider text,
  add column if not exists provider_reference text,
  add column if not exists provider_event_id text,
  add column if not exists idempotency_key text,
  add column if not exists gross_amount numeric,
  add column if not exists fee_amount numeric not null default 0,
  add column if not exists net_amount numeric,
  add column if not exists source_wallet_id uuid,
  add column if not exists destination_wallet_id uuid,
  add column if not exists completed_at timestamptz,
  add column if not exists failed_at timestamptz,
  add column if not exists failure_reason text,
  add column if not exists safe_metadata jsonb not null default '{}'::jsonb,
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists wallet_transactions_idempotency_key_idx
  on public.wallet_transactions (idempotency_key) where idempotency_key is not null;
create unique index if not exists wallet_transactions_provider_event_idx
  on public.wallet_transactions (provider, provider_event_id) where provider is not null and provider_event_id is not null;

create table if not exists public.withdrawal_addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  wallet_id uuid references public.wallets(id) on delete cascade,
  label text not null,
  asset text not null,
  network text not null,
  address text not null,
  memo text,
  address_type text not null default 'external',
  verification_status text not null default 'pending',
  verified_at timestamptz,
  disabled_at timestamptz,
  last_used_at timestamptz,
  safe_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint withdrawal_addresses_label_not_blank check (length(trim(label)) > 0),
  constraint withdrawal_addresses_address_not_blank check (length(trim(address)) > 0)
);

alter table public.withdrawal_addresses enable row level security;

drop policy if exists withdrawal_addresses_select_own on public.withdrawal_addresses;
create policy withdrawal_addresses_select_own on public.withdrawal_addresses for select using (auth.uid() = profile_id);

drop policy if exists withdrawal_addresses_insert_own on public.withdrawal_addresses;
create policy withdrawal_addresses_insert_own on public.withdrawal_addresses for insert with check (auth.uid() = profile_id);

drop policy if exists withdrawal_addresses_update_own_pending on public.withdrawal_addresses;
create policy withdrawal_addresses_update_own_pending on public.withdrawal_addresses for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id and verification_status in ('pending', 'disabled'));

create table if not exists public.capital_allocation_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  wallet_id uuid not null references public.wallets(id) on delete restrict,
  portfolio_id uuid not null references public.investment_portfolios(id) on delete restrict,
  asset text not null,
  network text not null,
  amount numeric not null,
  status text not null default 'pending_review',
  idempotency_key text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  executed_at timestamptz,
  canceled_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  safe_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint capital_allocation_requests_amount_positive check (amount > 0)
);

create unique index if not exists capital_allocation_requests_idempotency_key_idx
  on public.capital_allocation_requests (idempotency_key) where idempotency_key is not null;

alter table public.capital_allocation_requests enable row level security;

drop policy if exists capital_allocation_requests_select_own on public.capital_allocation_requests;
create policy capital_allocation_requests_select_own on public.capital_allocation_requests for select using (auth.uid() = profile_id);

create table if not exists public.transfer_aliases (
  id uuid primary key default gen_random_uuid(),
  alias text not null,
  normalized_alias text not null,
  owner_type text not null default 'profile',
  owner_id uuid not null,
  status text not null default 'pending',
  verified_at timestamptz,
  deactivated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transfer_aliases_normalized_format check (normalized_alias ~ '^[a-z0-9][a-z0-9._-]{2,31}$'),
  constraint transfer_aliases_reserved_names check (normalized_alias not in ('admin','support','security','neptlium','treasury','compliance','system')),
  unique (normalized_alias)
);

alter table public.transfer_aliases enable row level security;

drop policy if exists transfer_aliases_public_safe_lookup on public.transfer_aliases;
create policy transfer_aliases_public_safe_lookup on public.transfer_aliases for select using (status = 'active');

drop policy if exists capital_allocation_requests_insert_own on public.capital_allocation_requests;
create policy capital_allocation_requests_insert_own
  on public.capital_allocation_requests for insert
  with check (auth.uid() = profile_id);

create or replace function public.request_wallet_withdrawal(
  p_wallet_id uuid,
  p_asset text,
  p_network text,
  p_amount numeric,
  p_destination text,
  p_idempotency_key text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  available numeric;
  request_id uuid;
begin
  if uid is null then
    raise exception 'authentication required';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'amount must be positive';
  end if;
  if length(trim(coalesce(p_destination, ''))) = 0 then
    raise exception 'destination is required';
  end if;

  perform 1 from public.wallets where id = p_wallet_id and profile_id = uid;
  if not found then
    raise exception 'wallet not found';
  end if;

  select coalesce(sum(case when type = 'withdrawal' then -amount else amount end), 0)
    into available
    from public.wallet_transactions
    where wallet_id = p_wallet_id
      and profile_id = uid
      and status = 'completed'
      and type in ('deposit', 'withdrawal')
      and asset = p_asset
      and network = p_network;

  if available < p_amount then
    raise exception 'insufficient available balance';
  end if;

  insert into public.wallet_transactions (
    wallet_id, profile_id, type, asset, network, amount, status, counterparty,
    gross_amount, fee_amount, net_amount, source_wallet_id, idempotency_key
  ) values (
    p_wallet_id, uid, 'withdrawal', p_asset, p_network, p_amount, 'pending_review', trim(p_destination),
    p_amount, 0, p_amount, p_wallet_id, p_idempotency_key
  )
  on conflict (idempotency_key) where (idempotency_key is not null) do nothing
  returning id into request_id;

  if request_id is null then
    select id into request_id from public.wallet_transactions where idempotency_key = p_idempotency_key and profile_id = uid;
  end if;

  insert into public.audit_logs (user_id, action, table_name, record_id, metadata)
  values (uid, 'wallet.withdrawal_requested', 'wallet_transactions', request_id::text, jsonb_build_object('asset', p_asset, 'network', p_network));

  return request_id;
end;
$$;

revoke all on function public.request_wallet_withdrawal(uuid, text, text, numeric, text, text) from public;
grant execute on function public.request_wallet_withdrawal(uuid, text, text, numeric, text, text) to authenticated;
