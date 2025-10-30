import React, { createContext, useContext, useState, useEffect } from "react";
import { dashboardService } from "@/services/dashboardService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface DashboardContextType {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  loading: boolean;
  refreshDashboard: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
  });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardSummary();
      if (response.success) {
        setDashboardData({
          totalIncome: response.data.totalIncome,
          totalExpense: response.data.totalExpense,
          balance: response.data.balance,
          monthlyIncome: response.data.monthlyIncome,
          monthlyExpense: response.data.monthlyExpense,
        });
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      // Don't show error toast if not authenticated (expected 401)
      if (error.response?.status !== 401) {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only load dashboard if user is authenticated
    if (isAuthenticated) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <DashboardContext.Provider
      value={{
        totalIncome: dashboardData.totalIncome,
        totalExpense: dashboardData.totalExpense,
        balance: dashboardData.balance,
        monthlyIncome: dashboardData.monthlyIncome,
        monthlyExpense: dashboardData.monthlyExpense,
        loading,
        refreshDashboard: loadDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
};

