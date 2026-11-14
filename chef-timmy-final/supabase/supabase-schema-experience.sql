-- =====================================================
-- Tambahan skema: Experience (dari CV Chef Timmy)
-- Jalankan SETELAH supabase-schema.sql dan supabase-schema-additions.sql
-- =====================================================

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  role text not null,
  location text,
  period text,                       -- teks bebas: "2026", "Present", "2019"
  category text not null
    check (category in ('employment', 'venture', 'consulting', 'partnership')),
  sort_order int not null default 0,
  is_published boolean not null default true
);

alter table experiences enable row level security;

create policy "experiences_read" on experiences for select
  using (is_published or is_admin());
create policy "experiences_write" on experiences for all
  using (is_admin()) with check (is_admin());

-- -----------------------------------------------------
-- Data awal dari CV (urutan: terbaru ke terlama)
-- Admin bisa mengubah semuanya nanti lewat panel admin.
-- -----------------------------------------------------

-- Career
insert into experiences (organization, role, location, period, category, sort_order) values
  ('Semesta Bistro', 'Head Chef', 'Bali', 'Present', 'employment', 1),
  ('Taman The Garden', 'Head Chef', 'Bali', '2026', 'employment', 2),
  ('One Love Vegan Restaurant', 'Head Chef', 'Bali', '2026', 'employment', 3),
  ('PT Oufff Food Bali', 'General Manager', 'Bali', '2026', 'employment', 4),
  ('PT Brandina Kuliner Utama', 'Corporate Chef', 'Jakarta', '2024', 'employment', 5),
  ('PT Garda Triguna Artho', 'Corporate Chef & Chief Operating Officer', null, '2022', 'employment', 6),
  ('Padi Teras (Boutique Hotel)', 'Head Chef', 'Bali', '2019', 'employment', 7),
  ('Atmo Catering', 'Head Chef', 'Jakarta', '2019', 'employment', 8),
  ('Folie', 'Chef de Partie', 'Bali', '2018', 'employment', 9),
  ('Kanawa Coffee & Munch', 'Head Chef', null, '2017', 'employment', 10),
  ('Cassis Restaurant', 'Demi Chef', 'Jakarta', '2016', 'employment', 11),
  ('Abel''s Restaurant', 'Demi Chef', 'Bali', '2015', 'employment', 12),
  ('La Libre Restaurant', 'Demi Chef', 'Bali', '2014', 'employment', 13),
  ('Union Jakarta', 'Commis', 'Jakarta', '2013', 'employment', 14),
  ('The Westin Resort Nusa Dua', 'Cook Helper', 'Bali', '2011', 'employment', 15);

-- Ventures
insert into experiences (organization, role, location, period, category, sort_order) values
  ('Rucolas Kitchen', 'Founder', 'Jakarta', null, 'venture', 1),
  ('Steggo', 'Founder', 'Jakarta', null, 'venture', 2),
  ('Hotline Wings', 'Founder', 'Bali', null, 'venture', 3),
  ('Nasi Ayam Pak-Yu', 'Founder', null, null, 'venture', 4),
  ('Cone Pasta', 'Founder', 'Jakarta', null, 'venture', 5);

-- Consulting
insert into experiences (organization, role, location, period, category, sort_order) values
  ('Plus Bar', 'Chef Consultant', 'Bali', null, 'consulting', 1),
  ('Taru Ground', 'F&B Business Consultant', 'Bogor', '2026', 'consulting', 2),
  ('Coral Escape', 'F&B Consultant', 'Bali', null, 'consulting', 3),
  ('Playaround', 'F&B Consultant', 'Jakarta', null, 'consulting', 4),
  ('Kita Casa', 'F&B Consultant', 'Jakarta', null, 'consulting', 5),
  ('Brunch Story', 'F&B Consultant', 'Jakarta', null, 'consulting', 6),
  ('Whiley', 'Chef Consultant', 'Cibubur', null, 'consulting', 7),
  ('Dippy Dawg', 'F&B Consultant', 'Jakarta', null, 'consulting', 8),
  ('Artikula Coffee & Eatery', 'F&B Consultant', null, null, 'consulting', 9);

-- Partnerships & special projects
insert into experiences (organization, role, location, period, category, sort_order) values
  ('Loco By Nature', 'Kitchen Partnership', null, null, 'partnership', 1),
  ('Atmosfer Catering', 'Business Development', null, null, 'partnership', 2),
  ('Yes Bos', 'Private Chef Partnership', 'Jakarta', null, 'partnership', 3),
  ('Greenfield', 'Cooking Demonstration', 'Jakarta', null, 'partnership', 4);

-- -----------------------------------------------------
-- Opsional, aktifkan setelah Chef setuju nomornya dipublikasikan:
-- update site_content set value = '6287846267080'
--   where key = 'whatsapp_number';
-- -----------------------------------------------------
