import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Receipt, Calendar, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Receipt, label: "Transactions", path: "/transactions" },
  { icon: Calendar, label: "Reminders", path: "/reminders" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-border/40 bg-card/50 backdrop-blur-sm">
      <nav className="space-y-1 p-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
