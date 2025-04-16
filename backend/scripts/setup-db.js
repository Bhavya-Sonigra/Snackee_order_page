const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connected to database, executing SQL scripts...');

    // Read SQL file content
    const sqlFilePath = path.join(__dirname, '..', 'database.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');


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

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 