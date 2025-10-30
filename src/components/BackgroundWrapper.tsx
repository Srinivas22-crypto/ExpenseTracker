import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BackgroundWrapperProps {
  children: ReactNode;
  backgroundImage: string;
  className?: string;
}

export const BackgroundWrapper = ({ children, backgroundImage, className = "" }: BackgroundWrapperProps) => {
  return (
    <div className={`relative min-h-screen ${className}`}>
      <motion.div
        initial={{ scale: 1.05, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {children}
    </div>
  );
};
