import API from '@/api/axios';

export interface Income {
  id?: string;
  _id?: string;
  user?: string;
  amount: number;
  source: string;
  date: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IncomeResponse {
  success: boolean;
  data: Income;
  message?: string;
}

export interface IncomesResponse {
  success: boolean;
  data: Income[];
  count?: number;
  message?: string;
}

export interface IncomeStatsResponse {
  success: boolean;
  data: {
    totalIncome: number;
    count: number;
  };
}

export const incomeService = {
  getIncome: async (): Promise<IncomesResponse> => {
    const response = await API.get('/income');
    return response.data;
  },

  getIncomeById: async (id: string) => {
    const response = await API.get(`/income/${id}`);
    return response.data;
  },

  addIncome: async (income: Omit<Income, 'id' | '_id' | 'user'>): Promise<IncomeResponse> => {
    const response = await API.post('/income', income);
    return response.data;
  },

  updateIncome: async (id: string, income: Partial<Income>): Promise<IncomeResponse> => {
    const response = await API.put(`/income/${id}`, income);
    return response.data;
  },

  deleteIncome: async (id: string) => {
    const response = await API.delete(`/income/${id}`);
    return response.data;
  },

  getIncomeStats: async (): Promise<IncomeStatsResponse> => {
    const response = await API.get('/income/stats/summary');
    return response.data;
  },
};

