import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useMenu } from "@/context/MenuContext";

export const HamburgerMenu = () => {
  const { isMenuOpen, toggleMenu, closeMenu } = useMenu();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="flex flex-col justify-center items-center w-8 h-8 space-y-1 hover:bg-accent/50 rounded-md transition-colors"
        aria-label="Toggle menu"
      >
        <motion.div
          className="w-6 h-0.5 bg-foreground"
          animate={{
            rotate: isMenuOpen ? 45 : 0,
            y: isMenuOpen ? 6 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="w-6 h-0.5 bg-foreground"
          animate={{
            opacity: isMenuOpen ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="w-6 h-0.5 bg-foreground"
          animate={{
            rotate: isMenuOpen ? -45 : 0,
            y: isMenuOpen ? -6 : 0,
          }}
          transition={{ duration: 0.2 }}
        />
      </button>
    </div>
  );
};
