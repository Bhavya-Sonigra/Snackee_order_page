CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0.00
);

INSERT INTO items (name, price) VALUES
  ('ganthiya', 5.99),
  ('chevda', 4.99),
  ('sakarpara', 6.99),
  ('sev', 3.99),
  ('bhakarwadi', 7.99),
  ('chakli', 5.49)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(id),
  quantity INTEGER NOT NULL,
  weight VARCHAR(50),
  price_at_order DECIMAL(10, 2) DEFAULT 0.00
);