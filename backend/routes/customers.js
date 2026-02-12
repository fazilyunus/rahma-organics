const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getMyOrders
} = require('../controllers/customerController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/orders', auth, getMyOrders);

module.exports = router;
