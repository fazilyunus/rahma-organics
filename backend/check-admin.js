const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rahma_organics',
  password: '3455',
  port: 5432,
});

async function checkAndCreateAdmin() {
  try {
    console.log("🔍 Checking for admin user...");

    // Check if admin exists
    const result = await pool.query(
      "SELECT * FROM users WHERE email = 'admin@rahmaorganics.com'"
    );

    if (result.rows.length > 0) {
      console.log("✅ Admin user found!");
      console.log("Email:", result.rows[0].email);
      console.log("Role:", result.rows[0].role);
      
      // Delete and recreate with correct password
      console.log("\n🔄 Recreating admin with fresh password...");
      await pool.query("DELETE FROM users WHERE email = 'admin@rahmaorganics.com'");
    }

    // Create admin user with password: admin123
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      ["Admin", "admin@rahmaorganics.com", hashedPassword, "admin"]
    );

    console.log("\n✅ Admin user created successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("   Email: admin@rahmaorganics.com");
    console.log("   Password: admin123");
    console.log("\n🌐 Login at: http://localhost:3001/admin/login");

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await pool.end();
    process.exit(1);
  }
}

checkAndCreateAdmin();
