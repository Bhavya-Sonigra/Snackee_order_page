const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Database connection successful',
      timestamp: result.rows[0].now,
      database_url: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await pool.query(
      'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (session.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name',
      [username, email, password_hash, full_name]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required',
        field: !username ? 'username' : 'password'
      });
    }

    // Check user exists
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid username or password',
        field: 'username'
      });
    }

    const user = userResult.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ 
        message: 'Invalid username or password',
        field: 'password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ 
        message: 'Account is deactivated. Please contact support.',
        field: 'username'
      });
    }

    // Create token with additional claims
    const token = jwt.sign(
      { 
        userId: user.id,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name
        }
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Store session with additional metadata
    await pool.query(
      `INSERT INTO sessions (
        user_id, 
        token, 
        expires_at, 
        created_at, 
        last_activity,
        user_agent,
        ip_address
      ) VALUES ($1, $2, NOW() + INTERVAL '24 hours', NOW(), NOW(), $3, $4)`,
      [
        user.id, 
        token, 
        req.headers['user-agent'] || 'unknown',
        req.ip || req.connection.remoteAddress
      ]
    );

    // Update last login timestamp
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Return user data without sensitive information
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        last_login: user.last_login
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: 'An error occurred during login. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Protected Routes
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        description,
        CAST(price AS FLOAT) as price,
        image_url,
        category,
        spicy_level,
        CAST(COALESCE(discount, 0) AS FLOAT) as discount,
        created_at
      FROM products
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { customer_name, email, address, payment_method, items, total_amount } = req.body;
    
    const result = await pool.query(
      'INSERT INTO orders (user_id, customer_name, email, address, payment_method, items, total_amount, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [req.user.id, customer_name, email, address, payment_method, JSON.stringify(items), total_amount, 'pending']
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 