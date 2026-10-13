-- Storage hardening: allow authenticated owner to overwrite only with active consent.
-- The existing INSERT policy already checks active consent. UPSERT additionally requires UPDATE.
drop policy if exists "visiora_photo_update" on storage.objects;
create policy "visiora_photo_update" on storage.objects
for update to authenticated
using (
  bucket_id='visiora-private'
  and name=(select auth.uid())::text || '/style-photo'
  and exists (
    select 1 from public.photo_consents
    where user_id=(select auth.uid()) and revoked_at is null
  )
)
with check (
  bucket_id='visiora-private'
  and name=(select auth.uid())::text || '/style-photo'
  and exists (
    select 1 from public.photo_consents
    where user_id=(select auth.uid()) and revoked_at is null
  )
);
-- Restrict all photo operations to the canonical single-photo path.
drop policy if exists "visiora_photo_read" on storage.objects;
create policy "visiora_photo_read" on storage.objects for select to authenticated
using (bucket_id='visiora-private' and name=(select auth.uid())::text || '/style-photo');
drop policy if exists "visiora_photo_insert" on storage.objects;
create policy "visiora_photo_insert" on storage.objects for insert to authenticated
with check (
  bucket_id='visiora-private'
  and name=(select auth.uid())::text || '/style-photo'
  and exists (
    select 1 from public.photo_consents
    where user_id=(select auth.uid()) and revoked_at is null
  )
);
drop policy if exists "visiora_photo_delete" on storage.objects;
create policy "visiora_photo_delete" on storage.objects for delete to authenticated
using (bucket_id='visiora-private' and name=(select auth.uid())::text || '/style-photo');
