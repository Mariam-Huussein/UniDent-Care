"use client";

import { useStudentDashboardData } from "@/features/dashboard/hooks/useStudentDashboardData";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Clock, User, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function UpcomingDeadlines() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const { upcomingSessions } = useStudentDashboardData();
  const { data, isLoading, isError } = upcomingSessions;
  console.log(data);

  if (isError) {
    return (
      <Card className="h-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardContent className="flex items-center justify-center h-full p-8 text-destructive">
          {isRtl ? "حدث خطأ في تحميل الجلسات القادمة" : "Failed to load upcoming sessions"}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-lg relative overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      {/* Top accent border */}
      <div className="absolute top-0 right-0 h-1 w-full bg-indigo-500/80" />

      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <CalendarClock className="w-4 h-4" />
          {isRtl ? "الجلسات القادمة" : "Upcoming Sessions"}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 px-6 pb-6 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
            <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center h-[200px] text-slate-400 text-center">
            <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-3">
              <CalendarClock className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-medium text-sm">{isRtl ? "لا توجد جلسات قادمة" : "No upcoming sessions"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((session) => (
              <div key={session.id} className="group flex flex-col gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-500" />
                      <span className="font-bold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {session.patientName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      <Stethoscope className="w-4 h-4 text-emerald-500" />
                      <span>{session.treatmentType}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {format(new Date(session.scheduledAt), "MMM d, yyyy", { locale: isRtl ? ar : enUS })} •{" "}
                    {format(new Date(session.scheduledAt), "p", { locale: isRtl ? ar : enUS })} - {format(new Date(session.endAt), "p", { locale: isRtl ? ar : enUS })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
