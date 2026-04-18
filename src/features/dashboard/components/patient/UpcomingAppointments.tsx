"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  User,
  Filter,
  SearchX,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { UpcomingSessionWidget } from "@/services/PatientDashboardAnalytics";

interface UpcomingAppointmentsProps {
  upcomingSessions: UpcomingSessionWidget[];
}

export function UpcomingAppointments({ upcomingSessions }: UpcomingAppointmentsProps) {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const [limit, setLimit] = useState<number>(5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString(isRtl ? "ar-EG" : "en-US", { day: "numeric", month: "short", year: "numeric" }),
      time: date.toLocaleTimeString(isRtl ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="flex flex-col bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/20 dark:border-white/5 overflow-hidden transition-all duration-300 h-full" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <CalendarDays size={20} />
            </div>
            {t.dashApptTitle || "Upcoming Sessions"}
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
            {t.dashApptDesc || "Your next scheduled visits."}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Filter size={16} className="text-slate-400 dark:text-slate-500" />
          <label
            htmlFor="limit"
            className={`text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${isRtl ? 'ml-1' : 'mr-1'}`}
          >
            {t.dashApptShow || "Show"}
          </label>
          <input
            id="limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-12 bg-transparent text-sm font-black text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 text-center"
            dir="ltr"
          />
        </div>
      </div>

      <div className="p-6 flex-1">
        {upcomingSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingSessions.slice(0, limit).map((s, idx) => {
              const { day, time } = formatDate(s.date);
              return (
                <div key={idx} className="group relative flex items-center gap-5 p-5 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-all duration-300">
                  
                  {/* Decorative line */}
                  <div className={`absolute top-0 bottom-0 ${isRtl ? 'right-0' : 'left-0'} w-1.5 bg-blue-500 rounded-full scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300`} />

                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black shadow-inner">
                    <User size={24} />
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white text-base">
                        {s.doctorName}
                      </h4>
                      <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-2">
                        <Clock size={12} className="text-blue-400" /> {day} at {time}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50">
                        {s.status}
                      </span>
                      <button className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                        {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-full mb-6">
              <SearchX size={48} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t.dashApptEmptyTitle || "No upcoming sessions"}
            </h4>
            <p className="text-slate-400 dark:text-slate-500 font-medium max-w-sm">
              {t.dashApptEmptyDesc || "You are all caught up! There are no scheduled sessions at this time."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
