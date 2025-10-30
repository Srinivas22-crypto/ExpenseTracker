const asyncHandler = require('../utils/asyncHandler');
const Income = require('../models/Income');
const UserActivity = require('../models/UserActivity');

// @desc    Get all income entries
// @route   GET /api/income
// @access  Private
exports.getIncome = asyncHandler(async (req, res) => {
  const incomeEntries = await Income.find({ user: req.user._id }).sort({
    date: -1,
  });

  res.status(200).json({
    success: true,
    count: incomeEntries.length,
    data: incomeEntries,
  });
});

// @desc    Get single income entry
// @route   GET /api/income/:id
// @access  Private
exports.getIncomeById = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (!income) {
    return res.status(404).json({
      success: false,
      message: 'Income entry not found',
    });
  }

  // Make sure user owns income
  if (income.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this income entry',
    });
  }

  res.status(200).json({
    success: true,
    data: income,
  });
});

// @desc    Create income entry
// @route   POST /api/income
// @access  Private
exports.addIncome = asyncHandler(async (req, res) => {
  const { amount, source, date, notes } = req.body;

  // Validation
  if (!amount || !source || !date) {
    return res.status(400).json({
      success: false,
      message: 'Please provide amount, source, and date',
    });
  }

  const income = await Income.create({
    user: req.user._id,
    amount,
    source,
    date,
    notes,
  });

  // Log add income activity
  await UserActivity.create({
    userId: req.user._id,
    action: 'ADD_INCOME',
    details: {
      amount,
      source,
      date,
      incomeId: income._id,
    },
  });

  res.status(201).json({
    success: true,
    data: income,
  });
});

// @desc    Update income entry
// @route   PUT /api/income/:id
// @access  Private
exports.updateIncome = asyncHandler(async (req, res) => {
  let income = await Income.findById(req.params.id);

  if (!income) {
    return res.status(404).json({
      success: false,
      message: 'Income entry not found',
    });
  }

  // Make sure user owns income
  if (income.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this income entry',
    });
  }

  income = await Income.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Log update income activity
  await UserActivity.create({
    userId: req.user._id,
    action: 'UPDATE_INCOME',
    details: {
      incomeId: income._id,
      changes: req.body,
    },
  });

  res.status(200).json({
    success: true,
    data: income,
  });
});

// @desc    Delete income entry
// @route   DELETE /api/income/:id
// @access  Private
exports.deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (!income) {
    return res.status(404).json({
      success: false,
      message: 'Income entry not found',
    });
  }

  // Make sure user owns income
  if (income.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this income entry',
    });
  }

  // Log delete income activity before deletion
  await UserActivity.create({
    userId: req.user._id,
    action: 'DELETE_INCOME',
    details: {
      incomeId: income._id,
      amount: income.amount,
      source: income.source,
    },
  });

  await income.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get income statistics
// @route   GET /api/income/stats/summary
// @access  Private
exports.getIncomeStats = asyncHandler(async (req, res) => {
  const incomeEntries = await Income.find({ user: req.user._id });

  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);

  res.status(200).json({
    success: true,
    data: {
      totalIncome,
      count: incomeEntries.length,
    },
  });
});

