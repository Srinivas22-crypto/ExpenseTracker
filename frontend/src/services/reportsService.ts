import API from '@/api/axios';

export interface ReportsData {
  labels: string[];
  income: number[];
  expense: number[];
}

export interface ReportsResponse {
  success: boolean;
  data: ReportsData;
  message?: string;
}

export const reportsService = {
  getReports: async (
    filter: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
    month?: number,
    year?: number
  ): Promise<ReportsResponse> => {
    const params: any = { filter };
    if (month) params.month = month;
    if (year) params.year = year;
    
    const response = await API.get('/reports', { params });
    return response.data;
  },
};



