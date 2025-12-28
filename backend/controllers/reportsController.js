const asyncHandler = require('../utils/asyncHandler');
const Income = require('../models/Income');
const Transaction = require('../models/Transaction');

// Helper function to parse date string
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
      // Try DD/MM/YYYY format first
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    }
  }
  
  if (!date || isNaN(date.getTime())) return null;
  return date;
};

// @desc    Get reports data by filter
// @route   GET /api/reports
// @access  Private
exports.getReports = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { filter = 'monthly', month, year } = req.query;
  
  const now = new Date();
  const selectedMonth = month ? parseInt(month, 10) : now.getMonth() + 1;
  const selectedYear = year ? parseInt(year, 10) : now.getFullYear();
  
  // Get all income entries and transactions
  let incomeEntries = await Income.find({ user: userId }).sort({ date: -1 });
  let transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
  
  // Filter by month and year if provided
  if (month && year) {
    incomeEntries = incomeEntries.filter((income) => {
      const incomeDate = parseDate(income.date);
      if (!incomeDate) return false;
      return incomeDate.getFullYear() === selectedYear && 
             incomeDate.getMonth() + 1 === selectedMonth;
    });
    
    transactions = transactions.filter((transaction) => {
      const transactionDate = parseDate(transaction.date);
      if (!transactionDate) return false;
      return transactionDate.getFullYear() === selectedYear && 
             transactionDate.getMonth() + 1 === selectedMonth;
    });
  }
  
  let labels = [];
  let incomeData = [];
  let expenseData = [];
  
  // Aggregate data based on filter
  switch (filter) {
    case 'daily': {
      // Group by each day of the selected month
      const monthStart = new Date(selectedYear, selectedMonth - 1, 1);
      const monthEnd = new Date(selectedYear, selectedMonth, 0);
      const daysInMonth = monthEnd.getDate();
      
      const dataMap = new Map();
      
      // Initialize all days with day number as key
      for (let day = 1; day <= daysInMonth; day++) {
        dataMap.set(day.toString(), { income: 0, expense: 0 });
      }
      
      // Aggregate income
      incomeEntries.forEach((income) => {
        const incomeDate = parseDate(income.date);
        if (incomeDate && 
            incomeDate.getFullYear() === selectedYear && 
            incomeDate.getMonth() + 1 === selectedMonth) {
          const dayKey = incomeDate.getDate().toString();
          if (dataMap.has(dayKey)) {
            dataMap.get(dayKey).income += income.amount;
          }
        }
      });
      
      // Aggregate expenses
      transactions
        .filter(t => t.type === 'expense')
        .forEach((transaction) => {
          const transactionDate = parseDate(transaction.date);
          if (transactionDate && 
              transactionDate.getFullYear() === selectedYear && 
              transactionDate.getMonth() + 1 === selectedMonth) {
            const dayKey = transactionDate.getDate().toString();
            if (dataMap.has(dayKey)) {
              dataMap.get(dayKey).expense += transaction.amount;
            }
          }
        });
      
      // Convert to arrays (ordered by day)
      for (let day = 1; day <= daysInMonth; day++) {
        const dayKey = day.toString();
        const data = dataMap.get(dayKey) || { income: 0, expense: 0 };
        labels.push(day.toString());
        incomeData.push(data.income);
        expenseData.push(data.expense);
      }
      break;
    }
    
    case 'weekly': {
      // Group by week (last 7 days)
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 6);
      
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dataMap = new Map();
      
      // Initialize all days
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dayName = weekDays[date.getDay()];
        dataMap.set(dayName, { income: 0, expense: 0 });
      }
      
      // Aggregate data
      incomeEntries.forEach((income) => {
        const incomeDate = parseDate(income.date);
        if (incomeDate && incomeDate >= weekStart && incomeDate <= now) {
          const dayName = weekDays[incomeDate.getDay()];
          if (dataMap.has(dayName)) {
            dataMap.get(dayName).income += income.amount;
          }
        }
      });
      
      transactions
        .filter(t => t.type === 'expense')
        .forEach((transaction) => {
          const transactionDate = parseDate(transaction.date);
          if (transactionDate && transactionDate >= weekStart && transactionDate <= now) {
            const dayName = weekDays[transactionDate.getDay()];
            if (dataMap.has(dayName)) {
              dataMap.get(dayName).expense += transaction.amount;
            }
          }
        });
      
      // Convert to arrays (maintain day order)
      const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      orderedDays.forEach((day) => {
        if (dataMap.has(day)) {
          labels.push(day);
          const data = dataMap.get(day);
          incomeData.push(data.income);
          expenseData.push(data.expense);
        }
      });
      break;
    }
    
    case 'monthly': {
      // Group by each day of the current month
      const monthStart = new Date(selectedYear, selectedMonth - 1, 1);
      const monthEnd = new Date(selectedYear, selectedMonth, 0);
      const daysInMonth = monthEnd.getDate();
      
      const dataMap = new Map();
      
      // Initialize all days
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedYear, selectedMonth - 1, day);
        const dateKey = `${day}/${selectedMonth}`;
        dataMap.set(dateKey, { income: 0, expense: 0 });
      }
      
      // Aggregate data
      incomeEntries.forEach((income) => {
        const incomeDate = parseDate(income.date);
        if (incomeDate && 
            incomeDate.getFullYear() === selectedYear && 
            incomeDate.getMonth() + 1 === selectedMonth) {
          const dateKey = `${incomeDate.getDate()}/${selectedMonth}`;
          if (dataMap.has(dateKey)) {
            dataMap.get(dateKey).income += income.amount;
          }
        }
      });
      
      transactions
        .filter(t => t.type === 'expense')
        .forEach((transaction) => {
          const transactionDate = parseDate(transaction.date);
          if (transactionDate && 
              transactionDate.getFullYear() === selectedYear && 
              transactionDate.getMonth() + 1 === selectedMonth) {
            const dateKey = `${transactionDate.getDate()}/${selectedMonth}`;
            if (dataMap.has(dateKey)) {
              dataMap.get(dateKey).expense += transaction.amount;
            }
          }
        });
      
      // Convert to arrays
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${day}/${selectedMonth}`;
        labels.push(dateKey);
        const data = dataMap.get(dateKey);
        incomeData.push(data.income);
        expenseData.push(data.expense);
      }
      break;
    }
    
    case 'yearly': {
      // Group by month (Jan-Dec)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dataMap = new Map();
      
      // Initialize all months
      monthNames.forEach((month) => {
        dataMap.set(month, { income: 0, expense: 0 });
      });
      
      // Aggregate data
      incomeEntries.forEach((income) => {
        const incomeDate = parseDate(income.date);
        if (incomeDate && incomeDate.getFullYear() === selectedYear) {
          const monthName = monthNames[incomeDate.getMonth()];
          if (dataMap.has(monthName)) {
            dataMap.get(monthName).income += income.amount;
          }
        }
      });
      
      transactions
        .filter(t => t.type === 'expense')
        .forEach((transaction) => {
          const transactionDate = parseDate(transaction.date);
          if (transactionDate && transactionDate.getFullYear() === selectedYear) {
            const monthName = monthNames[transactionDate.getMonth()];
            if (dataMap.has(monthName)) {
              dataMap.get(monthName).expense += transaction.amount;
            }
          }
        });
      
      // Convert to arrays
      monthNames.forEach((month) => {
        labels.push(month);
        const data = dataMap.get(month);
        incomeData.push(data.income);
        expenseData.push(data.expense);
      });
      break;
    }
    
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid filter. Use: daily, weekly, monthly, or yearly',
      });
  }
  
  res.status(200).json({
    success: true,
    data: {
      labels,
      income: incomeData,
      expense: expenseData,
    },
  });
});

