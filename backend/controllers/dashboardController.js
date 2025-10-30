const asyncHandler = require('../utils/asyncHandler');
const Income = require('../models/Income');
const Transaction = require('../models/Transaction');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all income entries
  const incomeEntries = await Income.find({ user: userId });
  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);

  // Get all expense transactions
  const expenseTransactions = await Transaction.find({ 
    user: userId, 
    type: 'expense' 
  });
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Calculate balance
  const balance = totalIncome - totalExpense;

  // Get recent transactions (last 10)
  const recentTransactions = await Transaction.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10);

  // Get monthly breakdown
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const monthlyIncome = await Income.aggregate([
    { $match: { user: userId, date: { $gte: currentMonth.toISOString().split('T')[0] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const monthlyExpense = await Transaction.aggregate([
    { $match: { user: userId, type: 'expense', createdAt: { $gte: currentMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const monthlyIncomeTotal = monthlyIncome[0]?.total || 0;
  const monthlyExpenseTotal = monthlyExpense[0]?.total || 0;

  res.status(200).json({
    success: true,
    data: {
      totalIncome,
      totalExpense,
      balance,
      monthlyIncome: monthlyIncomeTotal,
      monthlyExpense: monthlyExpenseTotal,
      recentTransactions,
      incomeCount: incomeEntries.length,
      expenseCount: expenseTransactions.length,
    },
  });
});

