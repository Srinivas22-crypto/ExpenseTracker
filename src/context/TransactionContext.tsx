import React, { createContext, useContext, useState } from "react";

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
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      category: "Salary",
      amount: 75000,
      description: "Monthly Salary",
      date: "2025-10-01",
    },
    {
      id: "2",
      type: "expense",
      category: "Food",
      amount: 5000,
      description: "Grocery Shopping",
      date: "2025-10-15",
    },
    {
      id: "3",
      type: "expense",
      category: "Transport",
      amount: 2000,
      description: "Fuel",
      date: "2025-10-20",
    },
  ]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updatedData: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        balance,
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
