-- =====================================================
-- Skema database: Portofolio Chef Timmy Pramudyo
-- Jalankan di Supabase > SQL Editor
-- =====================================================

-- 1. Daftar admin (user yang boleh mengubah konten)
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function is_admin() returns boolean
language sql stable security definer as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- 2. Konten situs (hero, tagline, link sosial, dll) berbentuk key-value
create table if not exists site_content (
  key text primary key,            -- contoh: hero_title, hero_image, whatsapp_number
  value text not null default '',
  updated_at timestamptz default now()
);

insert into site_content (key, value) values
  ('hero_title', 'Chef Timmy Pramudyo'),
  ('hero_tagline', 'A Personal Journey Through Food, Passion & Purpose'),
  ('hero_image', ''),
  ('whatsapp_number', '62xxxxxxxxxx'),
  ('whatsapp_message', 'Halo Chef Timmy, saya tertarik dengan layanan private chef.'),
  ('instagram_url', ''),
  ('linkedin_url', '')
on conflict (key) do nothing;

-- 3. Bab cerita (My Story)
create table if not exists story_chapters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  body text not null default '',
  image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz default now()
);

-- 4. Layanan (Private Chef, Consulting, dll)
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

-- 5. Paket private chef
create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price_note text,                 -- contoh: "Mulai dari Rp 1.500.000 / orang"
  features text[] not null default '{}',
  sort_order int not null default 0,
  is_published boolean not null default true
);

-- 6. Galeri makanan
create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text,
  category text not null default 'Main Course',
  image_url text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz default now()
);

-- 7. Booking private chef
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  event_date date,
  guests int,
  location text,
  budget text,
  package_id uuid references packages(id) on delete set null,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'done', 'cancelled')),
  created_at timestamptz default now()
);

-- =====================================================
-- Row Level Security
-- =====================================================
alter table admins enable row level security;
alter table site_content enable row level security;
alter table story_chapters enable row level security;
alter table services enable row level security;
alter table packages enable row level security;
alter table gallery_items enable row level security;
alter table bookings enable row level security;

-- Admin hanya bisa dilihat oleh admin sendiri
create policy "admins_read_self" on admins
  for select using (user_id = auth.uid());

-- Konten publik: semua orang boleh baca, hanya admin boleh ubah
create policy "site_content_read" on site_content for select using (true);
create policy "site_content_write" on site_content for all
  using (is_admin()) with check (is_admin());

create policy "story_read" on story_chapters for select
  using (is_published or is_admin());
create policy "story_write" on story_chapters for all
  using (is_admin()) with check (is_admin());

create policy "services_read" on services for select
  using (is_published or is_admin());
create policy "services_write" on services for all
  using (is_admin()) with check (is_admin());

create policy "packages_read" on packages for select
  using (is_published or is_admin());
create policy "packages_write" on packages for all
  using (is_admin()) with check (is_admin());

create policy "gallery_read" on gallery_items for select
  using (is_published or is_admin());
create policy "gallery_write" on gallery_items for all
  using (is_admin()) with check (is_admin());

-- Booking: pengunjung boleh kirim, hanya admin boleh lihat/ubah/hapus
create policy "bookings_insert" on bookings for insert with check (true);
create policy "bookings_admin_read" on bookings for select using (is_admin());
create policy "bookings_admin_update" on bookings for update
  using (is_admin()) with check (is_admin());
create policy "bookings_admin_delete" on bookings for delete using (is_admin());

-- =====================================================
-- Storage: bucket untuk foto (publik dibaca, admin upload)
-- =====================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');
create policy "images_admin_insert" on storage.objects
  for insert with check (bucket_id = 'images' and is_admin());
create policy "images_admin_update" on storage.objects
  for update using (bucket_id = 'images' and is_admin());
create policy "images_admin_delete" on storage.objects
  for delete using (bucket_id = 'images' and is_admin());

-- =====================================================
-- Setelah membuat akun admin lewat Authentication > Users,
-- jadikan akun itu admin dengan perintah ini (ganti email):
--
-- insert into admins (user_id)
-- select id from auth.users where email = 'email-admin@contoh.com';
-- =====================================================
