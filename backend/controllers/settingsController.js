const pool = require('../models/db');

// Get all settings
exports.getSettings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  } catch (err) {
    console.error('getSettings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    
    for (const [key, value] of Object.entries(settings)) {
      await pool.query(
        `INSERT INTO site_settings (key, value, updated_at) 
         VALUES ($1, $2, CURRENT_TIMESTAMP) 
         ON CONFLICT (key) 
         DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      );
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error('updateSettings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all pages
exports.getPages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pages ORDER BY title');
    res.json(result.rows);
  } catch (err) {
    console.error('getPages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single page by slug
exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM pages WHERE slug = $1', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getPageBySlug error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update page
exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;
    
    const result = await pool.query(
      'UPDATE pages SET title = $1, content = $2, published = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, content, published, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updatePage error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
