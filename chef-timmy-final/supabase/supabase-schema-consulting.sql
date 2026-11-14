-- =====================================================
-- Tambahan skema: halaman Consulting
-- Jalankan SETELAH keempat file SQL sebelumnya.
-- =====================================================

-- 1. Layanan konsultasi (7 kartu "What you get")
create table if not exists consulting_services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true
);

-- 2. Tahapan proyek ("How a project works")
create table if not exists consulting_steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  is_published boolean not null default true
);

-- 3. Inquiry dari calon klien konsultasi
create table if not exists consulting_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  business_name text,
  business_type text,
  stage text,
  location text,
  services text[] not null default '{}',
  timeline text,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'proposal', 'active', 'closed')),
  created_at timestamptz default now()
);

alter table consulting_services enable row level security;
alter table consulting_steps enable row level security;
alter table consulting_inquiries enable row level security;

create policy "cservices_read" on consulting_services for select
  using (is_published or is_admin());
create policy "cservices_write" on consulting_services for all
  using (is_admin()) with check (is_admin());

create policy "csteps_read" on consulting_steps for select
  using (is_published or is_admin());
create policy "csteps_write" on consulting_steps for all
  using (is_admin()) with check (is_admin());

create policy "cinq_insert" on consulting_inquiries for insert with check (true);
create policy "cinq_read" on consulting_inquiries for select using (is_admin());
create policy "cinq_update" on consulting_inquiries for update
  using (is_admin()) with check (is_admin());
create policy "cinq_delete" on consulting_inquiries for delete using (is_admin());

-- 4. Data awal
insert into consulting_services (title, description, sort_order) values
  ('Menu Development', 'Menus built around your concept, your guests and your costs, with standardized recipes and food costing.', 1),
  ('Concept', 'A clear identity and direction for your venue, from positioning and offer to how it feels to walk in.', 2),
  ('Training', 'Hands-on training for kitchen, bar and service teams, so standards hold on a busy night.', 3),
  ('Kitchen Management', 'Workflow, SOPs, purchasing and inventory that keep quality steady and waste low.', 4),
  ('Bar Management', 'Drinks programs, bar operations and cost control that fit the concept.', 5),
  ('Service', 'Service standards and floor routines that turn good food into a good experience.', 6),
  ('Business', 'Financial planning, pricing and operating systems so the venture is commercially sound.', 7);

insert into consulting_steps (title, description, sort_order) values
  ('Discovery', 'We learn your business, your market, your location and your budget.', 1),
  ('Concept & Menu', 'We shape the concept and identity, then develop the menu with full costing.', 2),
  ('Systems & Team', 'We write the standards and SOPs, set up kitchen and bar, and help build the team.', 3),
  ('Training & Launch', 'We train the kitchen, bar and service teams, then support the opening.', 4),
  ('Handover & Review', 'After opening we review results together and hand the operation over to your team.', 5);

insert into site_content (key, value) values
  ('consulting_hero_title', 'From concept to a kitchen that runs itself.'),
  ('consulting_hero_text', 'Food and beverage consulting for cafes, restaurants, caterers and hotels. From the first idea to the first service and beyond.'),
  ('consulting_duration_note', 'Projects usually run three to six months, depending on the concept.'),
  ('consulting_why_title', 'Built from the inside.'),
  ('consulting_why_text', 'Chef Timmy has worked every side of the industry: hotel and restaurant kitchens since 2011, five ventures of his own, and a corporate role leading more than 200 team members across Indonesia. Consulting is where that experience goes to work for your business.')
on conflict (key) do nothing;
