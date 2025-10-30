import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { reminderService } from "@/services/reminderService";
import { useAuth } from "@/context/AuthContext";

export interface Reminder {
  id: string;
  recipient: string;
  amount: number;
  date: string;
  time: string;
  note?: string;
  repeat?: "none" | "daily" | "weekly" | "monthly";
  notified?: boolean;
}

interface ReminderContextType {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, "id">) => Promise<void>;
  updateReminder: (id: string, reminder: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  getRemindersForDate: (date: string) => Reminder[];
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only load reminders if user is authenticated
    if (isAuthenticated) {
      loadReminders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().slice(0, 5);

      reminders.forEach((reminder) => {
        if (reminder.date === today && reminder.time <= currentTime && !reminder.notified) {
          toast.info(
            `Reminder: Pay ₹${reminder.amount} to ${reminder.recipient}`,
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
          // Mark as notified
          setReminders((prev) =>
            prev.map((r) => (r.id === reminder.id ? { ...r, notified: true } : r))
          );
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [reminders]);

  const loadReminders = async () => {
    try {
      const response = await reminderService.getReminders();
      if (response.success) {
        setReminders(
          response.data.map((r: any) => ({
            id: r._id,
            recipient: r.recipient,
            amount: r.amount,
            date: r.date,
            time: r.time,
            note: r.note,
            repeat: r.repeat,
            notified: r.notified,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading reminders:", error);
      // Don't show error toast if not authenticated (expected 401)
    }
  };

  const addReminder = async (reminder: Omit<Reminder, "id">) => {
    try {
      const response = await reminderService.createReminder(reminder);
      if (response.success) {
        const newReminder: Reminder = {
          ...reminder,
          id: response.data._id,
          notified: false,
        };
        setReminders((prev) => [...prev, newReminder]);
        toast.success("Reminder added successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add reminder");
      throw error;
    }
  };

  const updateReminder = async (id: string, updatedData: Partial<Reminder>) => {
    try {
      const response = await reminderService.updateReminder(id, updatedData);
      if (response.success) {
        setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r)));
        toast.success("Reminder updated successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update reminder");
      throw error;
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const response = await reminderService.deleteReminder(id);
      if (response.success) {
        setReminders((prev) => prev.filter((r) => r.id !== id));
        toast.success("Reminder deleted successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete reminder");
      throw error;
    }
  };

  const getRemindersForDate = (date: string) => {
    return reminders.filter((r) => r.date === date);
  };

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        addReminder,
        updateReminder,
        deleteReminder,
        getRemindersForDate,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error("useReminders must be used within ReminderProvider");
  }
  return context;
};
