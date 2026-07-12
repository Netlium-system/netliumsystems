-- Additive prep for the institutional account-opening sequence (Purpose /
-- Institution Profile / Compliance steps) and a fix for RBAC role resolution.
-- All profiles columns are nullable — no existing rows are affected.

alter table "public"."profiles"
  add column if not exists "investor_type" text,
  add column if not exists "purpose" text,
  add column if not exists "legal_name" text,
  add column if not exists "jurisdiction" text,
  add column if not exists "compliance_status" text default 'pending',
  add column if not exists "provisioned_at" timestamp with time zone;

-- user_roles.role was an unconstrained free-text column defaulting to
-- 'member', which doesn't match the app's Role hierarchy
-- (user/operator/analyst/manager/admin/super_admin). Realign any existing
-- rows before constraining the column so this migration can't fail on data
-- that predates it.
update "public"."user_roles" set "role" = 'user' where "role" = 'member';

alter table "public"."user_roles"
  alter column "role" set default 'user';

alter table "public"."user_roles"
  add constraint "user_roles_role_check"
  check ("role" in ('user', 'operator', 'analyst', 'manager', 'admin', 'super_admin'));

-- RLS was enabled on user_roles with no SELECT policy, so a signed-in user
-- had no way to read their own role row (every lookup silently returned zero
-- rows). This is what apps/app's server-side resolveRole() queries against.
create policy "user_roles_select_own" on "public"."user_roles"
  for select using (("auth"."uid"() = "user_id"));
