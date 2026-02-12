const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");
const pool = require("../models/db");

router.get("/dashboard", auth, admin, (req, res) => {
  res.json({ message: "Welcome Admin 👑" });
});

// Product management
router.post("/products", auth, admin, createProduct);
router.put("/products/:id", auth, admin, updateProduct);
router.delete("/products/:id", auth, admin, deleteProduct);

// Order status update
router.put("/orders/:id/status", auth, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
