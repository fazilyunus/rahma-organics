require('dotenv').config();
const pool = require('../models/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'password';
  const role = process.argv[4] || 'admin';

  try {
    const hashed = await bcrypt.hash(password, 10);

    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [
      email,
    ]);

    if (exists.rows.length > 0) {
      const id = exists.rows[0].id;
      await pool.query('UPDATE users SET password=$1, role=$2 WHERE id=$3', [
        hashed,
        role,
        id,
      ]);
      console.log(`Updated user ${email} (id=${id})`);
    } else {
      const res = await pool.query(
        'INSERT INTO users (email, password, role) VALUES ($1,$2,$3) RETURNING id',
        [email, hashed, role]
      );
      console.log(`Created user ${email} (id=${res.rows[0].id})`);
    }
  } catch (err) {
    console.error('Error creating admin:', err.message || err);
  } finally {
    pool.end();
  }
}

createAdmin();
