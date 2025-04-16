const { Pool } = require('pg');
require('dotenv').config();

async function updateUsers() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connected to database, updating users table...');

    // Check if is_active column exists
    const checkColumnResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'is_active'
    `);

    if (checkColumnResult.rows.length === 0) {
      // Add is_active column
      await pool.query(`
        ALTER TABLE users
        ADD COLUMN is_active BOOLEAN DEFAULT TRUE
      `);
      console.log('Added is_active column to users table');
    } else {
      console.log('is_active column already exists');
    }

    // Update all existing users to be active
    await pool.query(`
      UPDATE users
      SET is_active = TRUE
      WHERE is_active IS NULL
    `);
    console.log('Updated existing users to be active');

    console.log('Users table update completed successfully');
  } catch (error) {
    console.error('Error updating users table:', error);
  } finally {
    await pool.end();
  }
}

updateUsers(); 