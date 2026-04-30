"use client";

import { useStudentDashboardData } from "@/features/dashboard/hooks/useStudentDashboardData";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Stethoscope } from "lucide-react";
import MyCustomButton from "@/components/ui/MyCustomButton";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

export default function UpcomingSessionCard() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const { sessions } = useStudentDashboardData();
  const { data, isLoading, isError } = sessions;

  // Find the next upcoming session
  const nextSession = data && data.length > 0 ? data[0] : null;

  if (isError) {
    return (
      <Card className="h-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardContent className="flex items-center justify-center h-full p-8 text-destructive">
          {isRtl ? "حدث خطأ في تحميل الجلسة" : "Failed to load session"}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden group" dir={isRtl ? "rtl" : "ltr"}>
      {/* Top accent border */}
      <div className="absolute top-0 right-0 h-1 w-full bg-indigo-500/80" />

      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <Calendar className="w-4 h-4" />
          {isRtl ? "الجلسة القادمة" : "Upcoming Session"}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 px-6 pb-6 flex flex-col justify-between">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
            <div className="h-6 w-3/4 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
            <div className="h-6 w-1/2 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
          </div>
        ) : !nextSession ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-6 text-center">
            <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-3">
              <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-medium text-sm">{isRtl ? "لا توجد جلسات قادمة" : "No upcoming sessions"}</p>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between gap-6">
            <div className="space-y-4">
              {/* Patient Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500">{isRtl ? "المريض" : "Patient"}</span>
                  <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{nextSession.patientName}</span>
                </div>
              </div>

              {/* Procedure */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500">{isRtl ? "الإجراء" : "Procedure"}</span>
                  {/* <span className="text-base font-semibold text-slate-800 dark:text-slate-200 leading-tight">{nextSession.caseType}</span> */}
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500">{isRtl ? "الوقت" : "Time"}</span>
                  <span className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 leading-tight">
                    {format(new Date(nextSession.scheduledAt), "p", { locale: isRtl ? ar : enUS })}
                    <span className="text-xs font-normal text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {format(new Date(nextSession.scheduledAt), "MMM d", { locale: isRtl ? ar : enUS })}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 w-full">
              <MyCustomButton variant="outline" className="w-full justify-center py-2 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20" rightIcon={isRtl ? undefined : <Clock className="w-4 h-4" />} leftIcon={isRtl ? <Clock className="w-4 h-4" /> : undefined}>
                {isRtl ? "عرض التفاصيل" : "View Details"}
              </MyCustomButton>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
