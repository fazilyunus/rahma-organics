const pool = require('../models/db');

exports.listUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
