const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'snackee',
  password: process.env.PGPASSWORD || 'bhavya',
  port: process.env.PGPORT || 5432,
});

module.exports = pool;