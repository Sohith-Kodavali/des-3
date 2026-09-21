-- ================================================================
-- ABC Kitchen — Supabase schema (single-tenant per project)
--
-- Run this in the Supabase SQL editor once, then paste your project
-- URL + anon key into js/supabase-client.js.
--
-- For multi-tenant (many restaurants on one project), duplicate each
-- table with a restaurant_id column and adjust RLS. For most cases,
-- one Supabase project per restaurant is simpler and cleaner.
-- ================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ---------- SETTINGS (single row) ----------
create table if not exists public.settings (
  id            uuid primary key default uuid_generate_v4(),
  brand_name    text default 'ABC Kitchen',
  tagline       text default 'Farm-picked, kitchen-crafted.',
  phone         text default '+91 00000 00000',
  whatsapp      text default '910000000000',
  address       text default '123 Placeholder Street',
  hours         text default '11:00 AM – 11:00 PM',
  open_time     text default '11:00',
  close_time    text default '23:00',
  admin_pass_hash text,                   -- SHA-256 of admin password
  updated_at    timestamptz default now()
);

-- ---------- MENU ITEMS ----------
create table if not exists public.menu_items (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  category    text not null,
  diet        text default 'veg',        -- 'veg' | 'nonveg'
  description text,
  price       int not null default 0,
  image       text,                       -- URL or 'img/x.jpeg' path
  tag         text,                       -- 'Signature' | 'Popular' | etc.
  featured    boolean default false,
  is_available boolean default true,
  sort_order  int default 100,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id          uuid primary key default uuid_generate_v4(),
  code        text generated always as ('#' || substr(id::text, 1, 6)) stored,
  mode        text not null,              -- 'Takeaway' | 'Delivery' | 'Dine-in'
  items       jsonb not null,             -- [{name, price, qty}]
  subtotal    int not null default 0,
  delivery    int not null default 0,
  total       int not null default 0,
  phone       text,
  address     text,
  notes       text,
  status      text default 'new',         -- 'new' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_status_idx  on public.orders (status);

-- ---------- RESERVATIONS ----------
create table if not exists public.reservations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  phone       text not null,
  date        date not null,
  time        text not null,              -- 'HH:MM'
  guests      int not null default 2,
  notes       text,
  status      text default 'new',         -- 'new' | 'confirmed' | 'seated' | 'cancelled'
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists reservations_date_idx on public.reservations (date, time);

-- ---------- REVIEWS ----------
create table if not exists public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  stars       int not null default 5 check (stars between 1 and 5),
  text        text not null,
  is_public   boolean default false,      -- admin approves before showing
  created_at  timestamptz default now()
);
create index if not exists reviews_created_idx on public.reviews (created_at desc);

-- ================================================================
-- Row Level Security (RLS)
-- With just the anon key in the browser, anyone can call the API.
-- These policies decide who reads/writes what.
-- ================================================================
alter table public.settings     enable row level security;
alter table public.menu_items   enable row level security;
alter table public.orders       enable row level security;
alter table public.reservations enable row level security;
alter table public.reviews      enable row level security;

-- Public reads: anyone (customers) can read settings, menu, and approved reviews.
create policy "read settings"        on public.settings     for select using (true);
create policy "read menu"            on public.menu_items   for select using (is_available);
create policy "read approved reviews" on public.reviews     for select using (is_public);

-- Public writes: anyone can insert a new order, reservation, or review.
create policy "insert orders"        on public.orders       for insert with check (true);
create policy "insert reservations"  on public.reservations for insert with check (true);
create policy "insert reviews"       on public.reviews      for insert with check (true);

-- Admin (via authenticated role) can do everything.
-- Use Supabase Auth to sign in an admin user, then these policies open.
create policy "admin all orders"        on public.orders       for all using (auth.role() = 'authenticated');
create policy "admin all reservations"  on public.reservations for all using (auth.role() = 'authenticated');
create policy "admin all reviews"       on public.reviews      for all using (auth.role() = 'authenticated');
create policy "admin all menu"          on public.menu_items   for all using (auth.role() = 'authenticated');
create policy "admin all settings"      on public.settings     for all using (auth.role() = 'authenticated');

-- ================================================================
-- Realtime — turn on for the tables the admin dashboard subscribes to
-- ================================================================
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.reservations;
alter publication supabase_realtime add table public.reviews;

-- ================================================================
-- Seed a settings row (safe to run multiple times)
-- ================================================================
insert into public.settings (brand_name, tagline)
select 'ABC Kitchen', 'Farm-picked, kitchen-crafted.'
where not exists (select 1 from public.settings);
