-- Extend the existing admin-only content store; keep its RLS policies unchanged.
alter table public.site_content drop constraint site_content_key_check;
alter table public.site_content add constraint site_content_key_check
check (key in ('appearance','course','strategies','macro','radar'));
