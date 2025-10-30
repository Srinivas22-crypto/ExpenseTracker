const asyncHandler = require('../utils/asyncHandler');
const UserActivity = require('../models/UserActivity');

// @desc    Log user activity
// @route   POST /api/activity/log
// @access  Private
exports.logActivity = asyncHandler(async (req, res) => {
  const { action, details } = req.body;
  const userId = req.user._id;

  // Validation
  if (!action) {
    return res.status(400).json({
      success: false,
      message: 'Please provide action type',
    });
  }

  // Get IP address if available
  const ipAddress = req.ip || req.connection.remoteAddress || null;

  const activity = await UserActivity.create({
    userId,
    action,
    details: details || {},
    ipAddress,
  });

  res.status(201).json({
    success: true,
    data: activity,
  });
});

// @desc    Get user activities
// @route   GET /api/activity
// @access  Private
exports.getActivities = asyncHandler(async (req, res) => {
  const { limit = 50, skip = 0 } = req.query;

  const activities = await UserActivity.find({ userId: req.user._id })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

  const total = await UserActivity.countDocuments({ userId: req.user._id });

  res.status(200).json({
    success: true,
    count: activities.length,
    total,
    data: activities,
  });
});

// @desc    Get activity statistics
// @route   GET /api/activity/stats
// @access  Private
exports.getActivityStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get activity counts by action type
  const stats = await UserActivity.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
      },
    },
  ]);

  const totalActivities = await UserActivity.countDocuments({ userId });

  // Get recent activities count (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentActivities = await UserActivity.countDocuments({
    userId,
    timestamp: { $gte: sevenDaysAgo },
  });

  res.status(200).json({
    success: true,
    data: {
      totalActivities,
      recentActivities,
      byAction: stats,
    },
  });
});

