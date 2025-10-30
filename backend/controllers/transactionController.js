const asyncHandler = require('../utils/asyncHandler');
const Transaction = require('../models/Transaction');
const UserActivity = require('../models/UserActivity');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found',
    });
  }

  // Make sure user owns transaction
  if (transaction.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this transaction',
    });
  }

  res.status(200).json({
    success: true,
    data: transaction,
  });
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
exports.createTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, description, date } = req.body;

  // Validation
  if (!type || !category || !amount || !description || !date) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  const transaction = await Transaction.create({
    user: req.user._id,
    type,
    category,
    amount,
    description,
    date,
  });

  // Log transaction activity
  if (type === 'expense') {
    await UserActivity.create({
      userId: req.user._id,
      action: 'ADD_EXPENSE',
      details: {
        amount,
        category,
        date,
        description,
        transactionId: transaction._id,
      },
    });
  }

  res.status(201).json({
    success: true,
    data: transaction,
  });
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = asyncHandler(async (req, res) => {
  let transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found',
    });
  }

  // Make sure user owns transaction
  if (transaction.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this transaction',
    });
  }

  transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Log update expense activity
  if (transaction.type === 'expense') {
    await UserActivity.create({
      userId: req.user._id,
      action: 'UPDATE_EXPENSE',
      details: {
        transactionId: transaction._id,
        changes: req.body,
      },
    });
  }

  res.status(200).json({
    success: true,
    data: transaction,
  });
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transaction not found',
    });
  }

  // Make sure user owns transaction
  if (transaction.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this transaction',
    });
  }

  // Log delete expense activity before deletion
  if (transaction.type === 'expense') {
    await UserActivity.create({
      userId: req.user._id,
      action: 'DELETE_EXPENSE',
      details: {
        transactionId: transaction._id,
        amount: transaction.amount,
        category: transaction.category,
      },
    });
  }

  await transaction.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats/summary
// @access  Private
exports.getStats = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id });

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  res.status(200).json({
    success: true,
    data: {
      totalIncome,
      totalExpense,
      balance,
    },
  });
});

