import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = ({ children, className, hover = false }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "rounded-xl border border-border/50 bg-card/70 backdrop-blur-lg shadow-lg transition-shadow",
        hover && "hover:shadow-glow",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
