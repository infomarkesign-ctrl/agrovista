/*
# Create orders table for AGROVISTA product catalog (single-tenant, no auth)

1. New Tables
- `orders`
  - `id` (uuid, primary key)
  - `customer_name` (text, not null)
  - `email` (text, not null)
  - `phone` (text, not null)
  - `address` (text, not null)
  - `city` (text, not null)
  - `state` (text, not null)
  - `pincode` (text, not null)
  - `items` (jsonb, not null) — array of {name, category, price, quantity}
  - `subtotal` (numeric, not null)
  - `shipping` (numeric, not null)
  - `total` (numeric, not null)
  - `status` (text, default 'pending')
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `orders`.
- Allow anon + authenticated full CRUD because this is a single-tenant no-auth catalog app;
  orders are intentionally submittable by any visitor and viewable for confirmation.

3. Notes
- No user_id / auth.users linkage — no sign-in screen in this app.
- Items stored as JSONB to keep a simple single-table order model.
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  shipping numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);
