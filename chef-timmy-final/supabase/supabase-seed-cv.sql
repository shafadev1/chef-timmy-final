-- =====================================================
-- Data awal dari CV Chef Timmy (sudah diolah, bahasa Inggris)
-- Jalankan SETELAH supabase-schema-additions.sql dan
-- supabase-schema-experience.sql
-- =====================================================

-- 1. Judul & profil
insert into site_content (key, value) values
  ('hero_title', 'Timmy Pramudyo'),
  ('hero_role', 'Executive Chef  |  Corporate Chef  |  F&B Business Consultant'),
  ('profile_text',
   'A culinary and food & beverage professional with experience across hotels, restaurants, catering, corporate culinary operations, and independent F&B ventures since 2011. His background spans kitchen leadership, multi-outlet operations, menu development, cost control, business development, and culinary consulting. He builds restaurant concepts and leads teams from operational planning all the way through execution.'),
  -- daftar dipisah tanda "|" agar mudah diedit sebagai chip di admin
  ('core_expertise',
   'Culinary Leadership|Menu Development & R&D|Kitchen Operations|Food Cost & COGS|SOP & Quality Control|Procurement & Inventory|F&B Consulting|Restaurant Concept Development|Team Training|Business Operations'),
  ('professional_focus',
   'Restaurant opening & concept development|Culinary standardization|Kitchen workflow optimization|Cost efficiency|Menu engineering|Team capability development')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- 2. Angka pencapaian di Home (menggantikan isi awal)
delete from stats;

insert into stats (value, label, sort_order) values
  ('15', 'Years in professional kitchens', 1),
  ('200+', 'Team members led across Indonesia', 2),
  ('5', 'F&B ventures founded', 3),
  ('9', 'Consulting clients', 4);

-- Catatan: angka "15" dihitung dari 2011 sampai 2026.
-- "200+" berasal dari autobiografi. "5" dan "9" dihitung dari daftar di CV.
-- Konfirmasi ke Chef sebelum dipublikasikan.
