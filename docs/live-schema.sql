-- Keep existing admin-only writes and member reads.
alter table public.site_content drop constraint site_content_key_check;
alter table public.site_content add constraint site_content_key_check check (key in ('appearance','course','strategies','macro','radar','live'));
