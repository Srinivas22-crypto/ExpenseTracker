import { useState } from "react";
import { BackgroundWrapper } from "@/components/BackgroundWrapper";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactions } from "@/context/TransactionContext";
import { TransactionForm } from "@/components/TransactionForm";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import transactionsBg from "@/assets/backgrounds/transactions-bg.jpg";

export const Transactions = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === "all" || t.type === filter;
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
      toast.success("Transaction deleted!");
    }
  };

  return (
    <BackgroundWrapper backgroundImage={transactionsBg}>
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Transactions</h1>
                <p className="text-muted-foreground">Manage all your income and expenses</p>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </div>

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
                    {filteredTransactions.map((transaction, index) => (
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
                                ? "bg-secondary/20 text-secondary"
                                : "bg-accent/20 text-accent"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-semibold text-right ${
                          transaction.type === "income" ? "text-secondary" : "text-accent"
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
                              onClick={() => handleDelete(transaction.id)}
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
            </GlassCard>
          </div>
        </main>
      </div>

      {showAddModal && <TransactionForm onClose={() => setShowAddModal(false)} />}
    </BackgroundWrapper>
  );
};
