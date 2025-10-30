import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardContent } from "@/components/DashboardContent";
import { TransactionsContent } from "@/components/TransactionsContent";
import { ReportsContent } from "@/components/ReportsContent";
import { SettingsContent } from "@/components/SettingsContent";
import { FileText, TrendingUp, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: FileText, label: "Transactions", id: "transactions" },
  { icon: TrendingUp, label: "Reports", id: "reports" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export const DashboardLayout = () => {
  const [activePage, setActivePage] = useState<string>("dashboard");

  const handlePageSelect = (pageId: string) => {
    setActivePage(pageId);
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "transactions":
        return <TransactionsContent />;
      case "reports":
        return <ReportsContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Dashboard
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Always Visible */}
        <aside className="w-64 border-r border-border/40 bg-card/50 backdrop-blur-sm h-[calc(100vh-4rem)]">
          <nav className="space-y-1 p-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <motion.button
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handlePageSelect(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all text-left",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </motion.button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content - Always Visible */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
