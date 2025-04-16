const { Pool } = require('pg');
require('dotenv').config();

async function fixSessionsToken() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connected to database, fixing sessions token column...');

    // Alter the token column to increase its size
    await pool.query(`
      ALTER TABLE sessions 
      ALTER COLUMN token TYPE TEXT
    `);
    console.log('Changed token column type to TEXT');

    console.log('Sessions token fix completed successfully');
  } catch (error) {
    console.error('Error fixing sessions token:', error);
  } finally {
    await pool.end();
  }
}

fixSessionsToken(); 