"use client";

import { Activity, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { DashboardKpis, DashboardProgress } from "@/services/PatientDashboardAnalytics";

interface StatsCardsProps {
  kpis: DashboardKpis;
  progress: DashboardProgress;
}

export function StatsCards({ kpis, progress }: StatsCardsProps) {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  
  // Use specific fallback labels gracefully until we verify translations exist
  const statItems = [
    {
      label: t.dashStatsActive || "Active Cases",
      value: kpis.activeCases,
      icon: Activity,
      gradient: "from-blue-600 to-indigo-600",
      glowColor: "shadow-blue-500/20",
      bgLight: "bg-blue-50/50",
      bgDark: "dark:bg-blue-900/20"
    },
    {
      label: t.dashStatsUpcoming || "Upcoming Sessions",
      value: kpis.pendingSessions,
      icon: Calendar,
      gradient: "from-purple-600 to-pink-600",
      glowColor: "shadow-purple-500/20",
      bgLight: "bg-purple-50/50",
      bgDark: "dark:bg-purple-900/20"
    },
    {
      label: t.dashStatsCompleted || "Completed Treatments",
      value: kpis.completedCases,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-500",
      glowColor: "shadow-emerald-500/20",
      bgLight: "bg-emerald-50/50",
      bgDark: "dark:bg-emerald-900/20"
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-colors duration-300`} dir={isRtl ? 'rtl' : 'ltr'}>
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-3xl p-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-lg hover:shadow-xl ${item.glowColor} transition-all duration-300 group`}
          >
            {/* Background Glow */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />

            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                    {item.value}
                  </h4>
                </div>
              </div>
              
              <div className={`p-3 rounded-2xl ${item.bgLight} ${item.bgDark} transition-transform group-hover:scale-110 duration-300`}>
                <div className={`text-transparent bg-clip-text bg-gradient-to-br ${item.gradient}`}>
                  <Icon size={24} strokeWidth={2.5} className="text-current" style={{ fill: "url(#gradient)" }} />
                </div>
              </div>
            </div>
            
            {/* Optional decoration */}
            <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${item.gradient} group-hover:w-full transition-all duration-500`} />
          </div>
        );
      })}

      {/* Special Overall Progress Card */}
      <div className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black text-white shadow-lg hover:shadow-2xl shadow-slate-900/20 transition-all duration-300 group`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        <div className="relative z-10 flex justify-between items-center h-full">
           <div>
             <p className="text-sm font-bold text-slate-300 mb-1 flex items-center gap-2">
                <TrendingUp size={16} /> Treatment Progress
             </p>
             <h4 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
               {progress.progressPercentage}%
             </h4>
             <p className="text-xs text-slate-400 mt-2 font-medium">
               {progress.completedSessions} of {progress.totalSessions} Sessions Done
             </p>
           </div>
           
           {/* Mini circular progress */}
           <div className="w-16 h-16 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  stroke="url(#progress-gradient)" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeDasharray={`${2 * Math.PI * 28}`} 
                  strokeDashoffset={`${(2 * Math.PI * 28) - (progress.progressPercentage / 100) * (2 * Math.PI * 28)}`} 
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>
           </div>
        </div>
      </div>
    </div>
  );
}