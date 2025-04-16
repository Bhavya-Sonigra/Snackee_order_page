# Order Page Application

A full-stack web application for ordering items with a shopping cart and multiple payment options.

## Tech Stack

- Frontend: React with TypeScript, Material-UI
- Backend: Node.js, Express
- Database: PostgreSQL

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Set up the database:
   ```bash
   psql -U postgres
   # Enter your password when prompted
   \i backend/database.sql
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Features

- Browse products
- Add items to cart
- View cart
- Checkout with multiple payment options:
  - Cash on Delivery (COD)
  - Credit Card
  - QR Code
- Order placement and confirmation

## API Endpoints

- GET `/api/products` - Get all products
- POST `/api/orders` - Create a new order

## Database Schema

### Products Table
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- image_url (TEXT)
- created_at (TIMESTAMP)

### Orders Table
- id (SERIAL PRIMARY KEY)
- customer_name (VARCHAR)
- email (VARCHAR)
- address (TEXT)
- payment_method (VARCHAR)
- items (JSONB)
- total_amount (DECIMAL)
- status (VARCHAR)
- created_at (TIMESTAMP) 