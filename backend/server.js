const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Rahma Organics API is running 🚀" });
});

// Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));
app.use("/api/mpesa", require("./routes/mpesa"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/admin", require("./routes/admin"));

// Database connection check
const pool = require("./models/db");
pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("❌ Database connection error:", err);
  else console.log("🟢 Database connected:", res.rows[0]);
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
