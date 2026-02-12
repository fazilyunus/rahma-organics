const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rahma_organics',
  password: '3455',
  port: 5432,
});

async function fixProductsTable() {
  try {
    console.log("🔧 Fixing products table...");

    // Add is_featured column
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false
    `);
    console.log("✅ Added is_featured column");

    // Check if image column exists, if not add it
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS image TEXT
    `);
    console.log("✅ Added/verified image column");

    console.log("\n🎉 Products table updated successfully!");
    console.log("You can now add products with images and featured status.");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await pool.end();
    process.exit(1);
  }
}

fixProductsTable();
