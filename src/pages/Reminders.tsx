import { useState } from "react";
import { BackgroundWrapper } from "@/components/BackgroundWrapper";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useReminders } from "@/context/ReminderContext";
import { ReminderForm } from "@/components/ReminderForm";
import { Plus } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import calendarBg from "@/assets/backgrounds/calendar-bg.jpg";

export const Reminders = () => {
  const { reminders, getRemindersForDate } = useReminders();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);

  const dateReminders = getRemindersForDate(selectedDate.toISOString().split("T")[0]);

  const tileContent = ({ date, view }: any) => {
    if (view === "month") {
      const dateStr = date.toISOString().split("T")[0];
      const hasReminder = reminders.some((r) => r.date === dateStr);
      if (hasReminder) {
        return <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary" />;
      }
    }
    return null;
  };

  return (
    <BackgroundWrapper backgroundImage={calendarBg}>
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Payment Reminders</h1>
                <p className="text-muted-foreground">Never miss a payment deadline</p>
              </div>
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Reminder
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">Calendar</h2>
                <div className="reminder-calendar">
                  <Calendar
                    onChange={(value: any) => setSelectedDate(value)}
                    value={selectedDate}
                    tileContent={tileContent}
                    className="w-full border-0 rounded-lg"
                  />
                </div>
              </GlassCard>

              {/* Reminders for Selected Date */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Reminders for {selectedDate.toLocaleDateString()}
                </h2>
                {dateReminders.length > 0 ? (
                  <div className="space-y-3">
                    {dateReminders.map((reminder, index) => (
                      <motion.div
                        key={reminder.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-accent/30 border border-border/40"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-lg">{reminder.recipient}</p>
                            <p className="text-2xl font-bold text-primary mt-1">
                              ₹{reminder.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              {reminder.time} • {reminder.repeat !== "none" && `Repeats ${reminder.repeat}`}
                            </p>
                            {reminder.note && (
                              <p className="text-sm mt-2 text-muted-foreground">{reminder.note}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No reminders for this date
                  </div>
                )}
              </GlassCard>

              {/* All Upcoming Reminders */}
              <GlassCard className="p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">All Upcoming Reminders</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reminders.map((reminder, index) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg bg-accent/20 border border-border/40"
                    >
                      <p className="font-semibold">{reminder.recipient}</p>
                      <p className="text-xl font-bold text-primary mt-1">
                        ₹{reminder.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {reminder.date} • {reminder.time}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>

      {showAddModal && <ReminderForm onClose={() => setShowAddModal(false)} />}
    </BackgroundWrapper>
  );
};
