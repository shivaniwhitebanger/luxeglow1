-- Run this SQL in your Supabase Dashboard -> SQL Editor to create the order tables
-- and allow order submissions from the application backend.

create table if not exists public.orders (
  id text primary key,
  order_number text not null,
  customer_id text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null default '',
  shipping_address_line1 text not null,
  shipping_address_line2 text default '',
  shipping_city text not null,
  shipping_state text not null,
  shipping_pincode text not null,
  shipping_address jsonb not null default '{}'::jsonb,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null,
  discount numeric not null default 0,
  shipping_fee numeric not null default 0,
  total numeric not null,
  coupon_code text,
  payment_method text not null,
  upi_id text,
  payment_status text not null default 'Pending',
  order_status text not null default 'Processing',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id text not null references public.orders(id) on delete cascade,
  order_number text not null,
  product_id text not null,
  product_name text not null,
  category text not null,
  unit_price numeric not null,
  quantity integer not null check (quantity > 0),
  line_total numeric not null,
  image text default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_customer_email on public.orders (customer_email);
create index if not exists idx_order_items_order_id on public.order_items (order_id);

-- Row Level Security policies for publishable / anon API key access
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Allow insert orders" on public.orders;
create policy "Allow insert orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow select orders" on public.orders;
create policy "Allow select orders"
  on public.orders
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow update orders" on public.orders;
create policy "Allow update orders"
  on public.orders
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Allow insert order_items" on public.order_items;
create policy "Allow insert order_items"
  on public.order_items
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow select order_items" on public.order_items;
create policy "Allow select order_items"
  on public.order_items
  for select
  to anon, authenticated
  using (true);
