import { useContext } from "react";
import { DashboardContext } from "@/context/DashboardContext";

/**
 * Custom hook to refresh dashboard data
 * This can be used from IncomeContext and TransactionContext
 */
export const useDashboardRefresh = () => {
  const context = useContext(DashboardContext);
  
  if (!context) {
    // Return a no-op function if context is not available (for safety)
    return () => Promise.resolve();
  }
  
  return context.refreshDashboard;
};

