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
  getDashboardSummary: async (month?: number, year?: number): Promise<DashboardResponse> => {
    const params: any = {};
    if (month && year) {
      params.month = month;
      params.year = year;
    }
    const response = await API.get('/dashboard', { params });
    return response.data;
  },
};

