import { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
  gradient?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend, trendValue, gradient = "bg-gradient-primary" }: StatsCardProps) => {
  return (
    <GlassCard hover className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold"
          >
            {value}
          </motion.p>
          {trendValue && (
            <p className={`text-xs ${trend === "up" ? "text-secondary" : "text-destructive"}`}>
              {trend === "up" ? "↑" : "↓"} {trendValue}
            </p>
          )}
        </div>
        <div className={`rounded-lg ${gradient} p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </GlassCard>
  );
};
