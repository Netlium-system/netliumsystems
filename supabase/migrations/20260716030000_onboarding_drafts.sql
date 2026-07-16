-- Persists only incomplete onboarding inputs so a refresh or network
-- interruption can resume account opening. Completed workspaces delete this row.
create table if not exists "public"."onboarding_drafts" (
  "user_id" uuid primary key references auth.users(id) on delete cascade,
  "data" jsonb not null default '{}'::jsonb,
  "step_index" integer not null default 0 check ("step_index" between 0 and 5),
  "updated_at" timestamp with time zone not null default now()
);

alter table "public"."onboarding_drafts" enable row level security;

create policy "onboarding_drafts_select_own" on "public"."onboarding_drafts"
  for select using (auth.uid() = user_id);

create policy "onboarding_drafts_insert_own" on "public"."onboarding_drafts"
  for insert with check (auth.uid() = user_id);

create policy "onboarding_drafts_update_own" on "public"."onboarding_drafts"
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
