"use client";

import { motion } from "framer-motion";
import { PieChart, Activity } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { DashboardCharts as IDashboardCharts } from "@/services/PatientDashboardAnalytics";

interface DashboardChartsProps {
  charts: IDashboardCharts;
}

export function DashboardCharts({ charts }: DashboardChartsProps) {
  const { language } = useLanguage();
  const isRtl = language === "ar";
  
  const totalCases = charts.casesDistribution.active + charts.casesDistribution.completed || 1; // prevent div by zero
  const activeCasesPerc = (charts.casesDistribution.active / totalCases) * 100;
  
  const totalSessions = charts.sessionsStatus.completed + charts.sessionsStatus.pending || 1;
  const completedSessionsPerc = (charts.sessionsStatus.completed / totalSessions) * 100;

  // Simple pure SVG donut chart calculation
  const circumference = 2 * Math.PI * 40; // r=40
  const casesDashoffset = circumference - (activeCasesPerc / 100) * circumference;
  const sessionsDashoffset = circumference - (completedSessionsPerc / 100) * circumference;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRtl ? "rtl" : "ltr"}`}>
      
      {/* Cases Distribution Card */}
      <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-xl transition-all duration-300 group">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <PieChart size={20} />
            </div>
            Cases Distribution
          </h3>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-indigo-500"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: casesDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{Math.round(activeCasesPerc)}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Active Cases</span>
              </div>
              <span className="font-black text-slate-800 dark:text-white">{charts.casesDistribution.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Completed</span>
              </div>
              <span className="font-black text-slate-800 dark:text-white">{charts.casesDistribution.completed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Status Card */}
      <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-xl transition-all duration-300 group">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Activity size={20} />
            </div>
            Sessions Status
          </h3>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-emerald-500"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: sessionsDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{Math.round(completedSessionsPerc)}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Done</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Completed</span>
              </div>
              <span className="font-black text-slate-800 dark:text-white">{charts.sessionsStatus.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Pending</span>
              </div>
              <span className="font-black text-slate-800 dark:text-white">{charts.sessionsStatus.pending}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
