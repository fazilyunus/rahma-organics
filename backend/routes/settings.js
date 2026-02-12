const router = require('express').Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  getSettings,
  updateSettings,
  getPages,
  getPageBySlug,
  updatePage
} = require('../controllers/settingsController');

// Public routes
router.get('/', getSettings);
router.get('/pages', getPages);
router.get('/pages/:slug', getPageBySlug);

// Admin routes
router.put('/', auth, admin, updateSettings);
router.put('/pages/:id', auth, admin, updatePage);

module.exports = router;
