import { StatsCard } from "@/components/StatsCard";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/context/TransactionContext";
import { useDashboard } from "@/context/DashboardContext";
import { useIncome } from "@/context/IncomeContext";
import { Wallet, TrendingUp, TrendingDown, Plus, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { IncomeForm } from "@/components/IncomeForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { transactionService } from "@/services/transactionService";
import { incomeService } from "@/services/incomeService";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const DashboardContent = () => {
  const { refreshDashboard, balance, monthlyIncome, totalExpense, loading: dashboardLoading } = useDashboard();
  const { transactions: contextTransactions } = useTransactions();
  const { incomes } = useIncome();
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  
  // Month and year state - default to current month/year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  
  // State for filtered transactions and data
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Generate available years (from 2020 to current year + 1)
  useEffect(() => {
    const years: number[] = [];
    const currentYear = currentDate.getFullYear();
    for (let year = 2020; year <= currentYear + 1; year++) {
      years.push(year);
    }
    setAvailableYears(years);
  }, []);

  // Fetch filtered data when month/year changes
  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setLoadingTransactions(true);
        const [transactionsResponse, incomesResponse] = await Promise.all([
          transactionService.getTransactions(selectedMonth, selectedYear),
          incomeService.getIncome(selectedMonth, selectedYear),
        ]);

        if (transactionsResponse.success && incomesResponse.success) {
          // Combine transactions and income entries
          const allTransactions: any[] = [
            ...transactionsResponse.data.map((t: any) => ({
              id: t._id || t.id,
              type: t.type,
              category: t.category,
              amount: t.amount,
              description: t.description,
              date: t.date,
            })),
            ...incomesResponse.data.map((i: any) => ({
              id: i._id || i.id,
              type: 'income' as const,
              category: i.source,
              amount: i.amount,
              description: i.notes || i.source,
              date: i.date,
            })),
          ];

          // Sort by date (most recent first)
          allTransactions.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          });

          setFilteredTransactions(allTransactions);
        }

        // Refresh dashboard with selected month/year
        await refreshDashboard(selectedMonth, selectedYear);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchFilteredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear, refreshTrigger]);

  const recentTransactions = filteredTransactions.slice(0, 5);

  // Calculate pie chart data
  const expenseData = useMemo(() => {
    const income = monthlyIncome || 0;
    const expense = totalExpense || 0;
    const total = income + expense;
    
    if (total === 0) {
      return [
        { name: "Income", value: 0, color: "#22c55e" },
        { name: "Expenses", value: 0, color: "#f97316" },
      ];
    }

    return [
      { 
        name: "Income", 
        value: income, 
        color: "#22c55e",
        percent: (income / total) * 100 
      },
      { 
        name: "Expenses", 
        value: expense, 
        color: "#f97316",
        percent: (expense / total) * 100 
      },
    ];
  }, [monthlyIncome, totalExpense]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(parseInt(month, 10));
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year, 10));
  };

  const getMonthName = (month: number) => {
    return MONTHS.find(m => m.value === month)?.label || MONTHS[month - 1]?.label || "";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your financial activity</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddIncomeModal(true)} className="gap-2" variant="outline">
            <DollarSign className="h-4 w-4" />
            Add Income
          </Button>
          <Button onClick={() => setShowAddTransactionModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Month/Year Filter */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">Filter by:</label>
            <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing data for {getMonthName(selectedMonth)} {selectedYear}
          </div>
        </div>
      </GlassCard>

      {/* Stats Cards */}
      {dashboardLoading || loadingTransactions ? (
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Balance"
            value={`₹${balance.toLocaleString()}`}
            icon={Wallet}
            gradient="bg-gradient-primary"
          />
          <StatsCard
            title="Monthly Income"
            value={`₹${monthlyIncome.toLocaleString()}`}
            icon={TrendingUp}
            gradient="bg-gradient-secondary"
            trend="up"
          />
          <StatsCard
            title="Total Expenses"
            value={`₹${totalExpense.toLocaleString()}`}
            icon={TrendingDown}
            gradient="bg-gradient-accent"
            trend="down"
          />
        </div>
      )}

      {/* Charts and Recent Transactions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Expense Chart */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
          {dashboardLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => {
                    const name = entry.name;
                    const percent = entry.percent || 0;
                    if (entry.value === 0) return "";
                    return `${name}: ${percent.toFixed(1)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        {/* Recent Transactions */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          {loadingTransactions ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "income" ? "text-green-500" : "text-orange-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found for {getMonthName(selectedMonth)} {selectedYear}.</p>
            </div>
          )}
        </GlassCard>
      </div>

      {showAddTransactionModal && (
        <TransactionForm 
          onClose={() => {
            setShowAddTransactionModal(false);
            // Trigger refresh after a short delay to allow backend to process
            setTimeout(() => {
              setRefreshTrigger(prev => prev + 1);
            }, 500);
          }} 
        />
      )}
      {showAddIncomeModal && (
        <IncomeForm 
          onClose={() => {
            setShowAddIncomeModal(false);
            // Trigger refresh after a short delay to allow backend to process
            setTimeout(() => {
              setRefreshTrigger(prev => prev + 1);
            }, 500);
          }} 
        />
      )}
    </div>
  );
};
