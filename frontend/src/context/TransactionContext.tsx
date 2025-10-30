import React, { createContext, useContext, useState, useEffect } from "react";
import { transactionService } from "@/services/transactionService";
import { useAuth } from "@/context/AuthContext";
import { useDashboardRefresh } from "@/hooks/useDashboardRefresh";
import { toast } from "react-toastify";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  totalIncome: number;
  totalExpense: number;
  loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const refreshDashboard = useDashboardRefresh();

  useEffect(() => {
    // Only load transactions if user is authenticated
    if (isAuthenticated) {
      loadTransactions();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactions();
      if (response.success) {
        setTransactions(response.data.map((t: any) => ({
          id: t._id,
          type: t.type,
          category: t.category,
          amount: t.amount,
          description: t.description,
          date: t.date,
        })));
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      // Don't show error toast if not authenticated (expected 401)
      if (error.response?.status !== 401) {
        toast.error("Failed to load transactions");
      }
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const response = await transactionService.createTransaction(transaction);
      if (response.success) {
        const newTransaction: Transaction = {
          ...transaction,
          id: response.data._id,
        };
        setTransactions((prev) => [newTransaction, ...prev]);
        toast.success("Transaction added successfully!");
        // Refresh dashboard to update totals
        await refreshDashboard();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add transaction");
      throw error;
    }
  };

  const updateTransaction = async (id: string, updatedData: Partial<Transaction>) => {
    try {
      const response = await transactionService.updateTransaction(id, updatedData);
      if (response.success) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
        );
        toast.success("Transaction updated successfully!");
        // Refresh dashboard to update totals
        await refreshDashboard();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update transaction");
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await transactionService.deleteTransaction(id);
      if (response.success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        toast.success("Transaction deleted successfully!");
        // Refresh dashboard to update totals
        await refreshDashboard();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete transaction");
      throw error;
    }
  };

  // Only calculate expenses from transactions (income is tracked separately)
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalExpense; // Balance will be calculated in Dashboard using Income context

  // Transactions are only expenses now
  const totalIncome = 0;

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        loading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within TransactionProvider");
  }
  return context;
};
