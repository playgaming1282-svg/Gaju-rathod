-- Run this in Supabase Dashboard > SQL Editor.
-- Public visitors can submit booking requests, but cannot read/update them.
-- Authenticated admin users can read/update booking statuses.
create extension if not exists pgcrypto;
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null check (char_length(customer_name) between 1 and 100),
  phone text not null check (char_length(phone) between 10 and 18),
  bhk text not null check (bhk in ('1 BHK','2 BHK','3 BHK','4 BHK')),
  wall_cleaning boolean not null default false,
  guide_price text not null,
  preferred_date date not null,
  preferred_time text not null,
  address text not null check (char_length(address) between 5 and 500),
  notes text not null default '' check (char_length(notes) <= 500),
  status text not null default 'new' check (status in ('new','contacted','confirmed','completed','cancelled'))
);
alter table public.bookings enable row level security;
-- Public form may INSERT only. Keep read/update restricted to authenticated users.
drop policy if exists "Anyone can submit booking request" on public.bookings;
create policy "Anyone can submit booking request" on public.bookings for insert to anon, authenticated
with check (
  char_length(customer_name) between 1 and 100 and
  char_length(phone) between 10 and 18 and
  bhk in ('1 BHK','2 BHK','3 BHK','4 BHK') and
  char_length(address) between 5 and 500 and
  char_length(notes) <= 500 and
  status = 'new'
);
drop policy if exists "Authenticated admins can read bookings" on public.bookings;
create policy "Authenticated admins can read bookings" on public.bookings for select to authenticated using (auth.uid() is not null);
drop policy if exists "Authenticated admins can update bookings" on public.bookings;
create policy "Authenticated admins can update bookings" on public.bookings for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
-- IMPORTANT: For a real business launch, restrict admin read/update policies to a specific admin UID or admin-role table.
-- The policies above are an initial single-owner prototype: anyone who can create a Supabase Auth account could otherwise access authenticated booking data if signups remain open.
-- Before public launch, disable public signups and create only your own admin account, then test policies with a second account.
