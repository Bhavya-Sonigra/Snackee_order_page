const { Pool } = require('pg');
require('dotenv').config();

async function updateUsersLastLogin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connected to database, updating users table with last_login...');

    // Check if last_login column exists
    const checkColumnResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'last_login'
    `);

    if (checkColumnResult.rows.length === 0) {
      // Add last_login column
      await pool.query(`
        ALTER TABLE users
        ADD COLUMN last_login TIMESTAMP
      `);
      console.log('Added last_login column to users table');
    } else {
      console.log('last_login column already exists');
    }

    // Check if role column exists
    const checkRoleResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'role'
    `);

    if (checkRoleResult.rows.length === 0) {
      // Add role column
      await pool.query(`
        ALTER TABLE users
        ADD COLUMN role VARCHAR(20) DEFAULT 'user'
      `);
      console.log('Added role column to users table');
    } else {
      console.log('role column already exists');
    }

    console.log('Users table update completed successfully');
  } catch (error) {
    console.error('Error updating users table:', error);
  } finally {
    await pool.end();
  }
}

updateUsersLastLogin(); 