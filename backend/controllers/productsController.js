const pool = require('../models/db');

exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('getAllProducts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getProductById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image, is_featured } = req.body;
    
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock, category, image, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, stock, category, image || null, is_featured || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, image, is_featured } = req.body;
    
    const result = await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category=$5, image=$6, is_featured=$7 WHERE id=$8 RETURNING *',
      [name, description, price, stock, category, image, is_featured, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateProduct error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('deleteProduct error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
