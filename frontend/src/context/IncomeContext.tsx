import React, { createContext, useContext, useState, useEffect } from "react";
import { incomeService } from "@/services/incomeService";
import { useAuth } from "@/context/AuthContext";
import { useDashboardRefresh } from "@/hooks/useDashboardRefresh";
import { toast } from "react-toastify";

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  notes?: string;
}

interface IncomeContextType {
  incomes: Income[];
  addIncome: (income: Omit<Income, "id">) => Promise<void>;
  updateIncome: (id: string, income: Partial<Income>) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  totalIncome: number;
  loading: boolean;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const IncomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const refreshDashboard = useDashboardRefresh();

  useEffect(() => {
    // Only load incomes if user is authenticated
    if (isAuthenticated) {
      loadIncomes();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadIncomes = async () => {
    try {
      setLoading(true);
      const response = await incomeService.getIncome();
      if (response.success) {
        setIncomes(
          response.data.map((i: any) => ({
            id: i._id,
            amount: i.amount,
            source: i.source,
            date: i.date,
            notes: i.notes,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading incomes:", error);
      // Don't show error toast if not authenticated (expected 401)
      if (error.response?.status !== 401) {
        toast.error("Failed to load incomes");
      }
    } finally {
      setLoading(false);
    }
  };

  const addIncome = async (income: Omit<Income, "id">) => {
    try {
      const response = await incomeService.addIncome(income);
      if (response.success) {
        const newIncome: Income = {
          ...income,
          id: response.data._id,
        };
        setIncomes((prev) => [newIncome, ...prev]);
        toast.success("Income added successfully!");
        // Refresh dashboard to update totals
        await refreshDashboard();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add income");
      throw error;
    }
  };

  const updateIncome = async (id: string, updatedData: Partial<Income>) => {
    try {
      const response = await incomeService.updateIncome(id, updatedData);
      if (response.success) {
        setIncomes((prev) => prev.map((i) => (i.id === id ? { ...i, ...updatedData } : i)));
        toast.success("Income updated successfully!");
        // Refresh dashboard to update totals
        await refreshDashboard();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update income");
      throw error;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      const response = await incomeService.deleteIncome(id);
      if (response.success) {
        setIncomes((prev) => prev.filter((i) => i.id !== id));
        toast.success("Income deleted successfully!");
        // Refresh dashboard to update totals
        await refreshDashboard();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete income");
      throw error;
    }
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <IncomeContext.Provider
      value={{
        incomes,
        addIncome,
        updateIncome,
        deleteIncome,
        totalIncome,
        loading,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncome = () => {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error("useIncome must be used within IncomeProvider");
  }
  return context;
};

