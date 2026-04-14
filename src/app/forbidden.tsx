"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, ShieldOff, LogIn } from "lucide-react";
import { FaTooth } from "react-icons/fa";

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden px-6 transition-colors duration-300">

      {/* Background decorations */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[500px] h-[500px] bg-amber-50 dark:bg-amber-900/10 rounded-full blur-[120px] -z-10 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-red-50 dark:bg-red-900/10 rounded-full blur-[100px] -z-10 transition-colors duration-300" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-br from-amber-50/50 to-red-50/50 dark:from-amber-900/5 dark:to-red-900/5 rounded-full blur-[80px] -z-10 transition-colors duration-300" />

      {/* Floating tooth icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-br from-amber-500 to-red-500 dark:from-amber-400 dark:to-red-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-200 dark:shadow-amber-900/50 rotate-12">
            <FaTooth size={36} className="text-white -rotate-12" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center shadow-lg"
          >
            <ShieldOff size={16} className="text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* 403 Number */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="relative mb-2"
      >
        <span className="text-[10rem] md:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-linear-to-b from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 select-none">
          403
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-[10rem] md:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-linear-to-r from-amber-500 to-red-500 dark:from-amber-400 dark:to-red-400 opacity-20">
          403
        </span>
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center max-w-lg -mt-10 relative z-10"
      >
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
          You don&apos;t have permission to access this page. Please sign in
          with an authorized account or contact your administrator.
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <Link
          href="/login"
          className="group h-14 px-10 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-blue-200 dark:shadow-blue-900/50 hover:bg-blue-700 dark:hover:bg-blue-600 hover:-translate-y-1 transition-all"
        >
          <LogIn size={20} />
          Sign In
        </Link>
        <Link
          href="/"
          className="group h-14 px-10 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
        >
          <Home size={20} />
          Go Home
        </Link>
        <button
          onClick={() => history.back()}
          className="group h-14 px-10 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>
      </motion.div>

      {/* Footer brand */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-8 flex items-center gap-2 grayscale opacity-40 dark:opacity-30"
      >
        <FaTooth size={16} className="dark:text-white" />
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
          UniDent Care
        </span>
      </motion.div>
    </div>
  );
}
