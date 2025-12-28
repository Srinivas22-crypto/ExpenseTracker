import API from '@/api/axios';

export interface Transaction {
  id?: string;
  _id?: string;
  user?: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction[];
  count?: number;
  message?: string;
}

export interface StatsResponse {
  success: boolean;
  data: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
}

export interface TransactionResponseWithTotals extends TransactionResponse {
  incomeTotal?: number;
  expenseTotal?: number;
  balance?: number;
}

export const transactionService = {
  getTransactions: async (month?: number, year?: number): Promise<TransactionResponseWithTotals> => {
    const params: any = {};
    if (month && year) {
      params.month = month;
      params.year = year;
    }
    const response = await API.get('/transactions', { params });
    return response.data;
  },

  getTransaction: async (id: string) => {
    const response = await API.get(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (transaction: Omit<Transaction, 'id' | '_id' | 'user'>) => {
    const response = await API.post('/transactions', transaction);
    return response.data;
  },

  updateTransaction: async (id: string, transaction: Partial<Transaction>) => {
    const response = await API.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  deleteTransaction: async (id: string) => {
    const response = await API.delete(`/transactions/${id}`);
    return response.data;
  },

  getStats: async (): Promise<StatsResponse> => {
    const response = await API.get('/transactions/stats/summary');
    return response.data;
  },
};

