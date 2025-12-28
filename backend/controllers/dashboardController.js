const asyncHandler = require('../utils/asyncHandler');
const Income = require('../models/Income');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get dashboard summary
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { month, year } = req.query;

  // Get all income entries and transactions
  let incomeEntries = await Income.find({ user: userId }).sort({ date: -1 });
  let transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

  // Filter by month and year if provided
  if (month && year) {
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Helper function to parse date
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      let date;
      
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        }
      } else if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          date = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        }
      }
      
      if (!date || isNaN(date.getTime())) return null;
      return date;
    };

    // Filter income entries
    incomeEntries = incomeEntries.filter((income) => {
      const incomeDate = parseDate(income.date);
      if (!incomeDate) return false;
      return incomeDate.getFullYear() === yearNum && 
             incomeDate.getMonth() + 1 === monthNum;
    });

    // Filter transactions
    transactions = transactions.filter((transaction) => {
      const transactionDate = parseDate(transaction.date);
      if (!transactionDate) return false;
      return transactionDate.getFullYear() === yearNum && 
             transactionDate.getMonth() + 1 === monthNum;
    });
  }

  // Calculate totals for filtered data
  const monthlyIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const monthlyExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = monthlyIncome - monthlyExpense;

  // Get recent transactions (last 10 from filtered set)
  const recentTransactions = transactions.slice(0, 10);

  // If no month/year specified, use all-time totals from user document
  let totalIncome = monthlyIncome;
  let totalExpense = monthlyExpense;
  
  if (!month || !year) {
    const user = await User.findById(userId).select('totalIncome totalExpense totalBalance');
    totalIncome = user?.totalIncome ?? monthlyIncome;
    totalExpense = user?.totalExpense ?? monthlyExpense;
  }

  res.status(200).json({
    success: true,
    data: {
      totalIncome: monthlyIncome,
      totalExpense: monthlyExpense,
      balance,
      monthlyIncome,
      monthlyExpense,
      recentTransactions,
      incomeCount: incomeEntries.length,
      expenseCount: transactions.filter(t => t.type === 'expense').length,
    },
  });
});

