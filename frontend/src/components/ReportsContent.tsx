import { GlassCard } from "@/components/GlassCard";
import { useTransactions } from "@/context/TransactionContext";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

export const ReportsContent = () => {
  const { transactions } = useTransactions();

  // Process data for charts
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = transaction.date.split("/")[1]; // Assuming date format DD/MM/YYYY
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }
    if (transaction.type === "income") {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expense += transaction.amount;
    }
    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number }>);

  const chartData = Object.values(monthlyData);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Analytics and insights</p>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Income & Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="hsl(var(--secondary))" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Bar Chart */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Income vs Expense Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="hsl(var(--secondary))" />
              <Bar dataKey="expense" fill="hsl(var(--accent))" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
};
