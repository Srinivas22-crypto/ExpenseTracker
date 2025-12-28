import { useState, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions } from "@/context/TransactionContext";
import { useIncome } from "@/context/IncomeContext";
import { TransactionForm } from "@/components/TransactionForm";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { transactionService } from "@/services/transactionService";
import { incomeService } from "@/services/incomeService";
import { Skeleton } from "@/components/ui/skeleton";

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

export const TransactionsContent = () => {
  const { deleteTransaction } = useTransactions();
  const { deleteIncome } = useIncome();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Month and year state - default to current month/year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  
  // State for filtered transactions
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Fetch filtered transactions when month/year changes
  useEffect(() => {
    const fetchFilteredTransactions = async () => {
      try {
        setLoading(true);
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
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredTransactions();
  }, [selectedMonth, selectedYear, refreshTrigger]);

  // Apply search and type filters
  const displayTransactions = filteredTransactions.filter((t) => {
    const matchesFilter = filter === "all" || t.type === filter;
    const matchesSearch = 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id: string, type: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        if (type === 'income') {
          await deleteIncome(id);
        } else {
          await deleteTransaction(id);
        }
        toast.success("Transaction deleted!");
        
        // Refresh the transactions list
        const [transactionsResponse, incomesResponse] = await Promise.all([
          transactionService.getTransactions(selectedMonth, selectedYear),
          incomeService.getIncome(selectedMonth, selectedYear),
        ]);

        if (transactionsResponse.success && incomesResponse.success) {
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

          allTransactions.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          });

          setFilteredTransactions(allTransactions);
        }
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

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
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage all your income and expenses</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Month/Year Filter */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
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
            Showing transactions for {getMonthName(selectedMonth)} {selectedYear}
          </div>
        </div>
      </GlassCard>

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Transactions List */}
      <GlassCard className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : displayTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Amount</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-border/40 hover:bg-accent/20"
                  >
                    <td className="px-6 py-4 text-sm">{transaction.date}</td>
                    <td className="px-6 py-4 text-sm font-medium">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm">{transaction.category}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "income"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-orange-500/20 text-orange-500"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right ${
                      transaction.type === "income" ? "text-green-500" : "text-orange-500"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction.id, transaction.type)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-lg text-muted-foreground">
              No transactions found for {getMonthName(selectedMonth)} {selectedYear}.
            </p>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or filter criteria.
              </p>
            )}
          </div>
        )}
      </GlassCard>

      {showAddModal && (
        <TransactionForm 
          onClose={() => {
            setShowAddModal(false);
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
