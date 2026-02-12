const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { getOrders, createOrder } = require('../controllers/ordersController');

// Middleware to optionally authenticate (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Token invalid, but continue as guest
    }
  }
  next();
};

// GET orders (admin only)
router.get('/', auth, admin, getOrders);

// POST create an order (guests or authenticated users)
router.post('/', optionalAuth, createOrder);

module.exports = router;
