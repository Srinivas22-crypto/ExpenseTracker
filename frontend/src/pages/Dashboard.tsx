import { BackgroundWrapper } from "@/components/BackgroundWrapper";
import { Navbar } from "@/components/Navbar";
import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/context/TransactionContext";
import { Wallet, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import dashboardBg from "@/assets/backgrounds/dashboard-bg.jpg";

export const Dashboard = () => {
  const { transactions, totalIncome, totalExpense, balance } = useTransactions();
  const [showAddModal, setShowAddModal] = useState(false);

  const recentTransactions = transactions.slice(0, 5);

  const expenseData = [
    { name: "Income", value: totalIncome, color: "hsl(var(--secondary))" },
    { name: "Expenses", value: totalExpense, color: "hsl(var(--accent))" },
  ];

  return (
    <BackgroundWrapper backgroundImage={dashboardBg}>
      <Navbar />
      <Layout>
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your financial activity</p>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Balance"
                value={`₹${balance.toLocaleString()}`}
                icon={Wallet}
                gradient="bg-gradient-primary"
              />
              <StatsCard
                title="Total Income"
                value={`₹${totalIncome.toLocaleString()}`}
                icon={TrendingUp}
                gradient="bg-gradient-secondary"
                trend="up"
                trendValue="12% from last month"
              />
              <StatsCard
                title="Total Expenses"
                value={`₹${totalExpense.toLocaleString()}`}
                icon={TrendingDown}
                gradient="bg-gradient-accent"
                trend="down"
                trendValue="8% from last month"
              />
            </div>

            {/* Charts and Recent Transactions */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Expense Chart */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
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
                        return `${name}: ${(percent * 100).toFixed(0)}%`;
                      }}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>

              {/* Recent Transactions */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
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
                            transaction.type === "income" ? "text-secondary" : "text-accent"
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
              </GlassCard>
            </div>
        </div>
      </Layout>

      {showAddModal && <TransactionForm onClose={() => setShowAddModal(false)} />}
    </BackgroundWrapper>
  );
};
