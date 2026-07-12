-- The Compliance onboarding step captures an acknowledgment checkbox but
-- previously discarded it — nothing downstream ever received or stored it.
-- Nullable, additive; no existing rows are affected.

alter table "public"."profiles"
  add column if not exists "compliance_acknowledged_at" timestamp with time zone;
