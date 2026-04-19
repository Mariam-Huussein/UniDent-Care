"use client";

import { useState } from "react";
import {
  ClipboardList,
  ChevronRight,
  ChevronLeft,
  History,
  Activity,
  ClipboardPen
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { RecentActivityWidget } from "@/services/PatientDashboardAnalytics";

interface RecentCasesProps {
  recentActivity: RecentActivityWidget[];
}

export function RecentCases({ recentActivity }: RecentCasesProps) {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const [limit, setLimit] = useState<number>(5);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'case':
        return <ClipboardList size={20} className="text-indigo-600 dark:text-indigo-400" />;
      case 'session':
        return <Activity size={20} className="text-emerald-600 dark:text-emerald-400" />;
      case 'diagnosis':
        return <ClipboardPen size={20} className="text-amber-600 dark:text-amber-400" />;
      default:
        return <ClipboardList size={20} className="text-slate-600 dark:text-slate-400" />;
    }
  };
  
  const getBgForType = (type: string) => {
    switch (type) {
      case 'case':
        return 'bg-indigo-50 dark:bg-indigo-900/30';
      case 'session':
        return 'bg-emerald-50 dark:bg-emerald-900/30';
      case 'diagnosis':
        return 'bg-amber-50 dark:bg-amber-900/30';
      default:
        return 'bg-slate-50 dark:bg-slate-800';
    }
  };

  return (
    <div className="flex flex-col bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/20 dark:border-white/5 overflow-hidden transition-all duration-300 h-full" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-inner">
            <History size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">
              {t.dashCasesTitle || "Recent Activity Timeline"}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              {"Latest updates on your account"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <span className={`text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${isRtl ? 'ml-1' : 'mr-1'}`}>
            {t.dashCasesLimit || "Limit"}
          </span>
          <input
            type="number"
            min={1}
            max={recentActivity.length || 10}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-12 bg-transparent text-center text-sm font-black text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
            dir="ltr"
          />
        </div>
      </div>

      <div className="p-6 flex-1">
        {recentActivity.length > 0 ? (
          <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 pl-6 space-y-8 mt-2 mb-2">
            {recentActivity.slice(0, limit).map((activity, idx) => (
              <div key={idx} className="relative group">
                <span className={`absolute -left-[35px] flex items-center justify-center w-10 h-10 rounded-full ${getBgForType(activity.type)} ring-4 ring-white dark:ring-slate-900 shadow-sm transition-transform group-hover:scale-110`}>
                  {getIconForType(activity.type)}
                </span>
                <div className="bg-white dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow group-hover:border-indigo-100 dark:group-hover:border-indigo-900/50">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">
                    {activity.description}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">
                    {new Date(activity.date).toLocaleString(isRtl ? 'ar-EG' : 'en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">{t.dashCasesEmpty || "No recent activity found"}</p>
          </div>
        )}
      </div>

      {recentActivity.length > limit && (
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 text-center border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setLimit((prev) => prev + 5)}
            className="text-sm font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-all uppercase tracking-widest"
          >
            {t.dashCasesShowMore || "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
