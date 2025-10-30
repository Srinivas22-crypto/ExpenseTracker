import { Link } from "react-router-dom";
import { BackgroundWrapper } from "@/components/BackgroundWrapper";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { useTransactions } from "@/context/TransactionContext";
import { Shield, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import landingBg from "@/assets/backgrounds/landing-bg.jpg";

export const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { totalIncome, totalExpense } = useTransactions();

  const features = [
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Track your spending patterns with beautiful charts and insights",
    },
    {
      icon: Calendar,
      title: "Payment Reminders",
      description: "Never miss a bill payment with smart reminder notifications",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and completely private",
    },
  ];

  return (
    <div className="relative min-h-screen landing-page-wrapper">
      {/* ₹500 Note Background with Gradient Overlay */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0.9 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="landing-page-bg absolute inset-0 -z-10 bg-cover bg-right"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url(${landingBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold mb-4">
                Hi, {user?.name} 👋
              </h2>
            </motion.div>
          )}

          <h1 className="text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Master Your Money
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take control of your finances with smart expense tracking, insightful analytics, and timely reminders
          </p>

          {!isAuthenticated ? (
            <div className="flex gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" className="group">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Stats Summary (for authenticated users) */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16"
          >
            <GlassCard className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Income</p>
              <p className="text-4xl font-bold text-secondary">₹{totalIncome.toLocaleString()}</p>
            </GlassCard>
            <GlassCard className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
              <p className="text-4xl font-bold text-accent">₹{totalExpense.toLocaleString()}</p>
            </GlassCard>
          </motion.div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <GlassCard hover className="p-6 text-center h-full">
                  <div className="bg-gradient-primary rounded-lg p-4 w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
