const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Railway PostgreSQL connection URL
const RAILWAY_DATABASE_URL = "postgresql://postgres:vXGAXRxWdzbQqjkjlLnveDwXoedDynFY@interchange.proxy.rlwy.net:46383/railway";

async function setupRailwayDatabase() {
  if (!RAILWAY_DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: RAILWAY_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connected to Railway database, executing SQL scripts...');

    // First run the setup tables scripts
    const sqlFilePath = path.join(__dirname, 'database.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split SQL into individual statements
    const statements = sqlContent
      .replace(/--.*\n/g, '') // Remove comments
      .replace(/\\c order_page_db;/g, '') // Remove database switching commands
      .replace(/CREATE DATABASE order_page_db;/g, '') // Remove database creation command
      .split(';')
      .filter(statement => statement.trim().length > 0);

    // Execute each SQL statement
    for (const statement of statements) {
      try {
        await pool.query(statement);
        console.log(`Executed: ${statement.substring(0, 50)}...`);
      } catch (err) {
        console.error(`Error executing statement: ${statement.substring(0, 100)}...`);
        console.error(err.message);
        // Continue with next statement
      }
    }

    // Run additional migration scripts for column updates
    console.log('Adding missing columns...');
    
    // Add is_active column to users table
    try {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE
      `);
      console.log('Added is_active column to users table');
    } catch (err) {
      console.error('Error adding is_active column:', err.message);
    }

    // Add last_login column to users table
    try {
      await pool.query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS last_login TIMESTAMP
      `);
      console.log('Added last_login column to users table');
    } catch (err) {
      console.error('Error adding last_login column:', err.message);
    }

    // Add role column to users table
    try {
      await pool.query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'
      `);
      console.log('Added role column to users table');
    } catch (err) {
      console.error('Error adding role column:', err.message);
    }

    // Add additional columns to sessions table
    try {
      await pool.query(`
        ALTER TABLE sessions 
        ALTER COLUMN token TYPE TEXT
      `);
      console.log('Changed token column type to TEXT');
    } catch (err) {
      console.error('Error changing token column type:', err.message);
    }

    try {
      const columns = [
        { name: 'last_activity', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
        { name: 'user_agent', type: 'VARCHAR(255)' },
        { name: 'ip_address', type: 'VARCHAR(45)' }
      ];

      for (const column of columns) {
        try {
          await pool.query(`
            ALTER TABLE sessions
            ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
          `);
          console.log(`Added ${column.name} column to sessions table`);
        } catch (err) {
          console.error(`Error adding ${column.name} column:`, err.message);
        }
      }
    } catch (err) {
      console.error('Error updating sessions table:', err.message);
    }

    console.log('Railway database setup completed successfully');
  } catch (error) {
    console.error('Error setting up Railway database:', error);
  } finally {
    await pool.end();
  }
}

setupRailwayDatabase(); 