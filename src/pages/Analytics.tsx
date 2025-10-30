import { BackgroundWrapper } from "@/components/BackgroundWrapper";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { useTransactions } from "@/context/TransactionContext";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import dashboardBg from "@/assets/backgrounds/dashboard-bg.jpg";

export const Analytics = () => {
  const { transactions, totalIncome, totalExpense } = useTransactions();

  const savingsPercent = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;
  const avgExpense = transactions.filter(t => t.type === "expense").length > 0
    ? (totalExpense / transactions.filter(t => t.type === "expense").length).toFixed(0)
    : 0;

  // Category breakdown
  const categoryData = transactions
    .filter(t => t.type === "expense")
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.category === t.category);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ category: t.category, amount: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.amount - a.amount);

  // Monthly trend (mock data for demo)
  const monthlyData = [
    { month: "Jul", income: 70000, expense: 45000 },
    { month: "Aug", income: 75000, expense: 48000 },
    { month: "Sep", income: 72000, expense: 50000 },
    { month: "Oct", income: 75000, expense: 52000 },
  ];

  return (
    <BackgroundWrapper backgroundImage={dashboardBg}>
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">Insights into your financial health</p>
            </div>

            {/* Insight Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard hover className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Savings Rate</p>
                  <p className="text-4xl font-bold text-secondary">{savingsPercent}%</p>
                  <p className="text-xs text-muted-foreground mt-2">of your income</p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard hover className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Avg. Expense</p>
                  <p className="text-4xl font-bold">₹{avgExpense}</p>
                  <p className="text-xs text-muted-foreground mt-2">per transaction</p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard hover className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Transactions</p>
                  <p className="text-4xl font-bold">{transactions.length}</p>
                  <p className="text-xs text-muted-foreground mt-2">this month</p>
                </GlassCard>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Monthly Trend */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Monthly Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="hsl(var(--secondary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" stroke="hsl(var(--accent))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>

              {/* Category Breakdown */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Expense by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </BackgroundWrapper>
  );
};
