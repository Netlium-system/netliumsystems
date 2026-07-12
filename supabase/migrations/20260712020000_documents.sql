-- Document repository: metadata table + a private Storage bucket. Documents
-- are institution-issued (statements, reports, compliance files) rather than
-- user-uploaded, so there is no end-user upload policy here — only
-- read-your-own, backed by a secure signed URL at download time.

create table if not exists "public"."documents" (
  "id" uuid primary key default gen_random_uuid(),
  "profile_id" uuid not null references auth.users(id) on delete cascade,
  "category" text not null check ("category" in (
    'statement', 'report', 'investment', 'compliance'
  )),
  "title" text not null,
  "storage_path" text not null,
  "created_at" timestamp with time zone not null default now()
);

alter table "public"."documents" enable row level security;

create policy "documents_select_own" on "public"."documents"
  for select using (auth.uid() = profile_id);

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "documents_storage_read_own" on storage.objects
  for select using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
