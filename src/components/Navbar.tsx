import { Link } from "react-router-dom";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ExpenseTracker
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-accent"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};
