const mongoose = require('mongoose');

const userActivitySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: ['LOGIN', 'LOGOUT', 'ADD_INCOME', 'ADD_EXPENSE', 'UPDATE_INCOME', 'UPDATE_EXPENSE', 'DELETE_INCOME', 'DELETE_EXPENSE', 'ADD_REMINDER', 'UPDATE_REMINDER', 'DELETE_REMINDER'],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('UserActivity', userActivitySchema);

