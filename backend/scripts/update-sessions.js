const { Pool } = require('pg');
require('dotenv').config();

async function updateSessions() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connected to database, updating sessions table...');

    // Check if columns exist and add them if they don't
    const columns = [
      { name: 'last_activity', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
      { name: 'user_agent', type: 'VARCHAR(255)' },
      { name: 'ip_address', type: 'VARCHAR(45)' }
    ];

    for (const column of columns) {
      const checkColumnResult = await pool.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'sessions' AND column_name = $1
      `, [column.name]);

      if (checkColumnResult.rows.length === 0) {
        await pool.query(`
          ALTER TABLE sessions
          ADD COLUMN ${column.name} ${column.type}
        `);
        console.log(`Added ${column.name} column to sessions table`);
      } else {
        console.log(`${column.name} column already exists`);
      }
    }

    console.log('Sessions table update completed successfully');
  } catch (error) {
    console.error('Error updating sessions table:', error);
  } finally {
    await pool.end();
  }
}

updateSessions(); 