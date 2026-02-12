require('dotenv').config();
const pool = require('../models/db');

(async () => {
  try {
    const res = await pool.query('INSERT INTO orders (user_id, items, total) VALUES ($1,$2,$3) RETURNING *', [2, JSON.stringify([{ product_id: 1, qty: 1 }]), 1500]);
    console.log('Inserted order:', res.rows[0]);
  } catch (err) {
    console.error('insert error:', err);
  } finally {
    pool.end();
  }
})();
