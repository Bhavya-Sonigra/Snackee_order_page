-- Create database
CREATE DATABASE order_page_db;

-- Connect to the database
\c order_page_db;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category VARCHAR(50),
    spicy_level INTEGER CHECK (spicy_level BETWEEN 0 AND 5),
    discount DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alter products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category VARCHAR(50),
ADD COLUMN IF NOT EXISTS spicy_level INTEGER CHECK (spicy_level BETWEEN 0 AND 5),
ADD COLUMN IF NOT EXISTS discount DECIMAL(5,2);

-- Alter orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Update sample products
UPDATE products SET 
    category = CASE 
        WHEN name ILIKE '%pizza%' THEN 'pizza'
        WHEN name ILIKE '%burger%' THEN 'burger'
        WHEN name ILIKE '%noodle%' OR name ILIKE '%ramen%' THEN 'noodles'
        WHEN name ILIKE '%drink%' OR name ILIKE '%tea%' OR name ILIKE '%coffee%' THEN 'drinks'
        ELSE 'other'
    END,
    spicy_level = 0,
    discount = NULL
WHERE category IS NULL;

-- Insert new sample products if not exists
INSERT INTO products (name, description, price, image_url, category, spicy_level)
SELECT * FROM (VALUES
    ('Margherita Pizza', 'Fresh tomatoes, mozzarella, basil, and olive oil', 12.99, 'https://example.com/pizza.jpg', 'pizza', 0),
    ('Spicy Ramen', 'Japanese noodles in spicy broth with pork and egg', 14.99, 'https://example.com/ramen.jpg', 'noodles', 3),
    ('Classic Burger', 'Juicy beef patty with lettuce, tomato, and cheese', 11.99, 'https://example.com/burger.jpg', 'burger', 1),
    ('Iced Tea', 'Refreshing black tea with lemon', 3.99, 'https://example.com/tea.jpg', 'drinks', 0)
) AS new_products
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = new_products.column1
); 