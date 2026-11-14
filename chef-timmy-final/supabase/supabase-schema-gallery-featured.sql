-- =====================================================
-- Tambahan: foto pilihan untuk halaman Home
-- Jalankan SETELAH supabase-schema-consulting.sql
-- =====================================================

alter table gallery_items
  add column if not exists is_featured boolean not null default false;

-- Supaya Home tidak berubah, 6 foto pertama yang sudah ada langsung ditandai.
-- Setelah itu Chef bisa memilih sendiri lewat Admin > Gallery (tombol bintang).
update gallery_items
set is_featured = true
where id in (
  select id from gallery_items
  where is_published
  order by sort_order
  limit 6
);
