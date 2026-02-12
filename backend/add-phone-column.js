const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rahma_organics',
  password: '3455',
  port: 5432,
});

async function addPhoneColumn() {
  try {
    console.log("🔧 Adding phone column to users table...");

    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20)
    `);

    console.log("✅ Phone column added successfully!");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await pool.end();
    process.exit(1);
  }
}

addPhoneColumn();
