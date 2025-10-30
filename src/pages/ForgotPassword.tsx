import { useState } from "react";
import { Link } from "react-router-dom";
import { BackgroundWrapper } from "@/components/BackgroundWrapper";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import loginBg from "@/assets/backgrounds/login-bg.jpg";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password reset link sent to your email!");
  };

  return (
    <BackgroundWrapper backgroundImage={loginBg}>
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-primary rounded-full p-4 w-fit mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="text-primary font-medium hover:underline">
                Back to Login
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </BackgroundWrapper>
  );
};
