import { Settings } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export function AdminFab() {
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  const handleClick = () => {
    // If the user is an admin, send them to the dashboard.
    // Otherwise, send them to the login page so they can authenticate.
    setLocation(isAdmin ? "/admin" : "/login");
  };

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gold text-ink shadow-xl hover:bg-ink hover:text-cream transition-colors duration-300"
    >
      <Settings className="w-5 h-5" />
    </motion.button>
  );
}

