"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { LogOut, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { authService } from "@/features/auth/services/authService";
import { logout as logoutAction } from "@/features/auth/store/authSlice";

interface LogoutButtonProps {
  variant?: "minimal" | "full";
  className?: string;
}

export default function LogoutButton({ variant = "full", className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const performCleanup = () => {
    Cookies.remove("token");
    Cookies.remove("user_role");
    
    dispatch(logoutAction());
    
    localStorage.clear(); 
    sessionStorage.clear();
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    const toastId = toast.loading("Securely signing out...");

    try {
      await authService.logout(); 
    } catch (error) {
      console.warn("Logout API warning:", error);
    } finally {
      performCleanup();
      
      toast.success("See you soon!", { id: toastId });
      
      router.replace("/login");
      router.refresh(); 
    }
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ${className}`}
        title="Sign Out"
      >
        {isLoggingOut ? <Loader2 className="animate-spin" size={20} /> : <LogOut size={20} />}
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-100 hover:border-red-200 text-red-700 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-red-100 group-hover:bg-white group-hover:shadow-sm transition-all ${isLoggingOut ? "text-red-400" : "text-red-600"}`}>
          {isLoggingOut ? <Loader2 className="animate-spin" size={18} /> : <LogOut size={18} />}
        </div>
        <div className="text-left">
          <p className="text-sm font-bold">Sign Out</p>
          <p className="text-xs text-red-500/80">End your current session</p>
        </div>
      </div>
      
      <LogOut size={16} className="opacity-0 group-hover:opacity-50 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
    </motion.button>
  );
}