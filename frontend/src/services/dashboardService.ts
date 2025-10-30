import API from '@/api/axios';

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  recentTransactions: any[];
  incomeCount: number;
  expenseCount: number;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardSummary;
  message?: string;
}

export const dashboardService = {
  getDashboardSummary: async (): Promise<DashboardResponse> => {
    const response = await API.get('/dashboard');
    return response.data;
  },
};

