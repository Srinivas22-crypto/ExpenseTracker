import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

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
  addReminder: (reminder: Omit<Reminder, "id">) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  getRemindersForDate: (date: string) => Reminder[];
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      recipient: "Electricity Bill",
      amount: 2500,
      date: "2025-10-28",
      time: "10:00",
      note: "Monthly electricity bill payment",
      repeat: "monthly",
    },
  ]);

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

  const addReminder = (reminder: Omit<Reminder, "id">) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      notified: false,
    };
    setReminders((prev) => [...prev, newReminder]);
  };

  const updateReminder = (id: string, updatedData: Partial<Reminder>) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r)));
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
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
