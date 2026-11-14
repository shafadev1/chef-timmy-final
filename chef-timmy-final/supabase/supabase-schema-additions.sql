-- =====================================================
-- Tambahan skema (jalankan SETELAH supabase-schema.sql)
-- Fitur: angka pencapaian, sample menu, detail & harga paket,
-- FAQ, cerita hidangan signature, Beyond the Plate, download buku
-- Semua konten dalam bahasa Inggris.
-- =====================================================

-- 1. Angka pencapaian (strip di Home)
create table if not exists stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,            -- contoh: "200+"
  label text not null,            -- contoh: "Team members led"
  sort_order int not null default 0,
  is_published boolean not null default true
);

insert into stats (value, label, sort_order) values
  ('2011', 'Started in professional kitchens', 1),
  ('200+', 'Team members led nationwide', 2),
  ('2016', 'Opened own restaurant in Jakarta', 3),
  ('2017', 'First culinary consulting project', 4)
on conflict do nothing;

-- 2. Detail & transparansi harga untuk paket private chef
alter table packages
  add column if not exists price_from numeric,           -- angka dasar, contoh 1500000
  add column if not exists price_unit text default 'per guest',
  add column if not exists min_guests int,
  add column if not exists max_guests int,
  add column if not exists includes text[] not null default '{}',
  add column if not exists excludes text[] not null default '{}';

-- 3. Contoh menu (tasting menu, dll)
create table if not exists sample_menus (
  id uuid primary key default gen_random_uuid(),
  name text not null,                    -- contoh: "Four-Course Tasting Menu"
  description text,
  courses jsonb not null default '[]',   -- [{"label":"Starter","dish":"...","note":"..."}]
  image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

-- 4. FAQ private chef
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true
);

insert into faqs (question, answer, sort_order) values
  ('Which areas do you serve?', 'Edit this answer in the admin panel.', 1),
  ('Are ingredients and equipment included?', 'Edit this answer in the admin panel.', 2),
  ('Can you accommodate allergies or dietary needs?', 'Edit this answer in the admin panel.', 3),
  ('How many guests can you cook for?', 'Edit this answer in the admin panel.', 4),
  ('How do booking and payment work?', 'Edit this answer in the admin panel.', 5)
on conflict do nothing;

-- 5. Galeri: tandai hidangan signature + cerita di baliknya
alter table gallery_items
  add column if not exists story text,
  add column if not exists is_signature boolean not null default false;

-- 6. Beyond the Plate (satu blok kecil) + download autobiografi
insert into site_content (key, value) values
  ('btp_title', 'Beyond the Plate'),
  ('btp_body', 'Before the kitchen, there was basketball. Away from the pass, you will still find him on the court, with his dogs close by.'),
  ('btp_image', ''),
  ('autobiography_url', ''),
  ('autobiography_button_label', 'Download Autobiography')
on conflict (key) do nothing;

-- 7. RLS untuk tabel baru
alter table stats enable row level security;
alter table sample_menus enable row level security;
alter table faqs enable row level security;

create policy "stats_read" on stats for select using (is_published or is_admin());
create policy "stats_write" on stats for all
  using (is_admin()) with check (is_admin());

create policy "menus_read" on sample_menus for select using (is_published or is_admin());
create policy "menus_write" on sample_menus for all
  using (is_admin()) with check (is_admin());

create policy "faqs_read" on faqs for select using (is_published or is_admin());
create policy "faqs_write" on faqs for all
  using (is_admin()) with check (is_admin());

-- 8. Storage untuk PDF autobiografi (publik dibaca, admin upload)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

create policy "documents_public_read" on storage.objects
  for select using (bucket_id = 'documents');
create policy "documents_admin_insert" on storage.objects
  for insert with check (bucket_id = 'documents' and is_admin());
create policy "documents_admin_update" on storage.objects
  for update using (bucket_id = 'documents' and is_admin());
create policy "documents_admin_delete" on storage.objects
  for delete using (bucket_id = 'documents' and is_admin());
