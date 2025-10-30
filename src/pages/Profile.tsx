import { BackgroundWrapper } from "@/components/BackgroundWrapper";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import loginBg from "@/assets/backgrounds/login-bg.jpg";

export const Profile = () => {
  const { user } = useAuth();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <BackgroundWrapper backgroundImage={loginBg}>
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your account settings</p>
            </div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        defaultValue={user?.name}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user?.email}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button type="submit">Save Changes</Button>
                </form>
              </GlassCard>
            </motion.div>

            {/* Change Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-8">
                <h3 className="text-xl font-semibold mb-6">Change Password</h3>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button type="submit">Update Password</Button>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>
    </BackgroundWrapper>
  );
};
