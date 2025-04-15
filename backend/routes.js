const express = require('express');
const pool = require('./db');
const router = express.Router();

// Get all available items
router.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price FROM items ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Submit a new order
router.post('/orders', async (req, res) => {
  const { customer, items, payment } = req.body;
  
  // Validate required fields
  if (!customer || !customer.name || !customer.email || !customer.phone || !items || items.length === 0 || !payment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Start a transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Calculate total amount (we'll update this with actual prices from the database)
    let totalAmount = 0;
    
    // Insert the order
    const orderInsert = 'INSERT INTO orders (customer_name, customer_email, customer_phone, payment_method, total_amount) VALUES ($1, $2, $3, $4, $5) RETURNING id';
    const orderValues = [customer.name, customer.email, customer.phone, payment, totalAmount];
    const orderResult = await client.query(orderInsert, orderValues);
    const orderId = orderResult.rows[0].id;
    
    // Insert each order item
    for (const item of items) {
      // Get the current price of the item
      const priceQuery = 'SELECT price FROM items WHERE id = $1';
      const priceResult = await client.query(priceQuery, [item.item_id]);
      
      if (priceResult.rows.length === 0) {
        throw new Error(`Item with ID ${item.item_id} not found`);
      }
      
      const price = priceResult.rows[0].price;
      totalAmount += price * item.quantity;
      
      // Insert the order item
      const itemInsert = 'INSERT INTO order_items (order_id, item_id, quantity, weight, price_at_order) VALUES ($1, $2, $3, $4, $5)';
      const itemValues = [orderId, item.item_id, item.quantity, item.weight || null, price];
      await client.query(itemInsert, itemValues);
    }
    
    // Update the total amount in the order
    await client.query('UPDATE orders SET total_amount = $1 WHERE id = $2', [totalAmount, orderId]);
    
    // Commit the transaction
    await client.query('COMMIT');
    
    // Return the order details
    const orderDetails = await client.query(
      `SELECT o.*, 
        (SELECT json_agg(json_build_object('id', oi.id, 'item_id', oi.item_id, 'quantity', oi.quantity, 'weight', oi.weight, 'price', oi.price_at_order)) 
         FROM order_items oi WHERE oi.order_id = o.id) as items 
       FROM orders o WHERE o.id = $1`, 
      [orderId]
    );
    
    res.status(201).json(orderDetails.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order placement error:', err);
    res.status(500).json({ error: 'Failed to place order: ' + err.message });
  } finally {
    client.release();
  }
});

// Get order details by ID
router.get('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await pool.query(
      `SELECT o.*, 
        (SELECT json_agg(json_build_object('id', oi.id, 'item_id', oi.item_id, 'quantity', oi.quantity, 'weight', oi.weight, 'price', oi.price_at_order)) 
         FROM order_items oi WHERE oi.order_id = o.id) as items 
       FROM orders o WHERE o.id = $1`, 
      [orderId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;