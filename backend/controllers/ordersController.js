const pool = require('../models/db');

exports.getOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('getOrders error:', err);
    if (err.code === '42P01') {
      return res.status(501).json({ message: 'Orders table does not exist. Create an `orders` table to enable this endpoint.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createOrder = async (req, res) => {
  const { items, total } = req.body;

  if (typeof total === 'undefined') {
    return res.status(400).json({ message: 'Missing order data (total)' });
  }

  try {
    // Get user_id from authenticated user if available
    const user_id = req.user ? req.user.id : null;

    // orders table in the DB has columns: id, user_id, total, status, created_at
    const result = await pool.query(
      'INSERT INTO orders (user_id, total, status) VALUES ($1,$2,$3) RETURNING *',
      [user_id, total, 'pending']
    );

    const order = result.rows[0];

    // If there's no separate order_items table, we won't persist items here.
    // Echo back items in the response so clients can see what they submitted.
    if (items) order.items = items;

    res.status(201).json(order);
  } catch (err) {
    console.error('createOrder error:', err);
    if (err.code === '42P01') {
      return res.status(501).json({ message: 'Orders table does not exist. Create an `orders` table to enable this endpoint.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
