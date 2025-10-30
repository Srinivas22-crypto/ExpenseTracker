import API from '@/api/axios';

export interface Reminder {
  id?: string;
  _id?: string;
  user?: string;
  recipient: string;
  amount: number;
  date: string;
  time: string;
  note?: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  notified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReminderResponse {
  success: boolean;
  data: Reminder[];
  count?: number;
  message?: string;
}

export const reminderService = {
  getReminders: async (): Promise<ReminderResponse> => {
    const response = await API.get('/reminders');
    return response.data;
  },

  getReminder: async (id: string) => {
    const response = await API.get(`/reminders/${id}`);
    return response.data;
  },

  createReminder: async (reminder: Omit<Reminder, 'id' | '_id' | 'user'>) => {
    const response = await API.post('/reminders', reminder);
    return response.data;
  },

  updateReminder: async (id: string, reminder: Partial<Reminder>) => {
    const response = await API.put(`/reminders/${id}`, reminder);
    return response.data;
  },

  deleteReminder: async (id: string) => {
    const response = await API.delete(`/reminders/${id}`);
    return response.data;
  },

  getRemindersByDate: async (date: string): Promise<ReminderResponse> => {
    const response = await API.get(`/reminders/date/${date}`);
    return response.data;
  },
};

