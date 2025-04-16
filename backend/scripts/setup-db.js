const { Pool } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default postgres database first
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Check if database exists
    const result = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'food_ordering']
    );

    if (result.rows.length === 0) {
      // Database doesn't exist, create it
      await pool.query(`CREATE DATABASE ${process.env.DB_NAME || 'food_ordering'}`);
      console.log(`Database ${process.env.DB_NAME || 'food_ordering'} created successfully`);
    } else {
      console.log(`Database ${process.env.DB_NAME || 'food_ordering'} already exists`);
    }
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 