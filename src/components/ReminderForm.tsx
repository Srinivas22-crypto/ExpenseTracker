import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useReminders } from "@/context/ReminderContext";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface ReminderFormProps {
  onClose: () => void;
}

export const ReminderForm = ({ onClose }: ReminderFormProps) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  
  const { addReminder } = useReminders();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReminder({
      recipient,
      amount: parseFloat(amount),
      date,
      time,
      note,
      repeat,
    });
    toast.success("Reminder added successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Add Reminder</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient/Bill Name</Label>
              <Input
                id="recipient"
                placeholder="Electricity Bill"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="2500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Repeat</Label>
              <Select value={repeat} onValueChange={(value: any) => setRepeat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Don't Repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Reminder
              </Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};
