const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { listUsers } = require('../controllers/usersController');

// List users (admin only)
router.get('/', auth, admin, listUsers);

module.exports = router;
