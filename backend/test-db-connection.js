require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres', // Connect to default database first
  password: String(process.env.DB_PASSWORD),
  port: 5432,
});

async function testConnection() {
  try {
    console.log('Testing connection with:');
    console.log('User:', process.env.DB_USER);
    console.log('Host:', process.env.DB_HOST);
    console.log('Password:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
    
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log('Server time:', result.rows[0].now);
    
    // Try to create database
    await pool.query('CREATE DATABASE rahma_organics');
    console.log('✅ Database created!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Error code:', err.code);
  } finally {
    await pool.end();
  }
}

testConnection();
