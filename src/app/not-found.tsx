"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { FaTooth } from "react-icons/fa";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden px-6 transition-colors duration-300">
      <Navbar/>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-[100px] -z-10 transition-colors duration-300" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/5 dark:to-indigo-900/5 rounded-full blur-[80px] -z-10 transition-colors duration-300" />

      {/* Floating tooth icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="relative">
          <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200 dark:shadow-blue-900/50 rotate-12">
            <FaTooth size={36} className="text-white -rotate-12" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 dark:bg-red-400 rounded-full flex items-center justify-center shadow-lg"
          >
            <SearchX size={16} className="text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* 404 Number */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="relative mb-2"
      >
        <span className="text-[10rem] md:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-linear-to-b from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 select-none">
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-[10rem] md:text-[14rem] font-black leading-none text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 opacity-20">
          404
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
          Page Not Found
        </h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
          Oops! It seems this page has gone missing. Don&apos;t worry — let&apos;s
          get you back on track.
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
          href="/dashboard"
          className="group my-btn px-10"
        >
          <Home size={20} />
          Go Home
        </Link>
      </motion.div>
      <Footer/>
    </div>
  );
}
