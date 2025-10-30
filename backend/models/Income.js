const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: [0, 'Amount must be positive'],
    },
    source: {
      type: String,
      required: [true, 'Please add a source'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please add a date'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Income', incomeSchema);

