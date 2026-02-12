const pool = require("../models/db");
const bcrypt = require("bcryptjs");

async function initDatabase() {
  try {
    console.log("🔧 Initializing database...");

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Users table created");

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        stock INT DEFAULT 0,
        category VARCHAR(50),
        image TEXT,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Products table created");

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT,
        total NUMERIC NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Orders table created");

    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id),
        product_id INT REFERENCES products(id),
        quantity INT NOT NULL,
        price NUMERIC NOT NULL
      )
    `);
    console.log("✅ Order items table created");

    // Create discounts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS discounts (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(20) NOT NULL,
        value NUMERIC NOT NULL,
        active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP
      )
    `);
    console.log("✅ Discounts table created");

    // Create payments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id),
        mpesa_receipt VARCHAR(50),
        status VARCHAR(30) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Payments table created");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING`,
      ["Admin", "admin@rahmaorganics.com", hashedPassword, "admin"]
    );
    console.log("✅ Admin user created (email: admin@rahmaorganics.com, password: admin123)");

    // Insert sample products
    const sampleProducts = [
      {
        name: "Organic Hair Oil",
        description: "Nourishing blend of natural oils for healthy, shiny hair",
        price: 1200,
        stock: 50,
        category: "Hair Care",
      },
      {
        name: "Body Butter",
        description: "Rich moisturizing butter for soft, smooth skin",
        price: 1500,
        stock: 30,
        category: "Body Care",
      },
      {
        name: "Face Serum",
        description: "Anti-aging serum with organic ingredients",
        price: 2000,
        stock: 25,
        category: "Skin Care",
      },
      {
        name: "Lip Balm",
        description: "Natural lip balm with shea butter",
        price: 500,
        stock: 100,
        category: "Lip Care",
      },
      {
        name: "Body Scrub",
        description: "Exfoliating scrub with natural ingredients",
        price: 1800,
        stock: 40,
        category: "Body Care",
      },
    ];

    for (const product of sampleProducts) {
      await pool.query(
        `INSERT INTO products (name, description, price, stock, category) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [product.name, product.description, product.price, product.stock, product.category]
      );
    }
    console.log("✅ Sample products added");

    console.log("\n🎉 Database initialization complete!");
    console.log("\n📝 Admin Login:");
    console.log("   Email: admin@rahmaorganics.com");
    console.log("   Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initDatabase();
