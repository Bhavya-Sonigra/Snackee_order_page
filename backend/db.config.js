const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'order_page_db',
  password: 'bhavya',
  port: 5432,
});

module.exports = pool; 