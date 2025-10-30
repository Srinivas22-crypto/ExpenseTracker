const express = require('express');
const router = express.Router();
const {
  logActivity,
  getActivities,
  getActivityStats,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.post('/log', protect, logActivity);
router.get('/', protect, getActivities);
router.get('/stats', protect, getActivityStats);

module.exports = router;

