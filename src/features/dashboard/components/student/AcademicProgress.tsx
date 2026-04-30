"use client";

import { useStudentStats } from "@/features/dashboard/hooks/useStudentStats";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

export default function AcademicProgress() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const { stats, loading } = useStudentStats();

  const percentage = stats.totalSessions > 0 ? Math.round((stats.completedSessions / stats.totalSessions) * 100) : 0;

  return (
    <Card className="h-full flex flex-col rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-lg" dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader className="pb-4 pt-6 px-6 flex flex-row justify-between items-start space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {isRtl ? "التقدم الأكاديمي" : "Academic Progress"}
          </CardTitle>
          <CardDescription className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {stats.completedSessions} / {stats.totalSessions} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{isRtl ? "جلسات" : "Sessions"}</span>
          </CardDescription>
        </div>
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
          <Target className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-6 flex flex-col justify-end">
        {loading ? (
          <div className="space-y-4">
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full" />
            <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md" />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {isRtl ? "نسبة الإنجاز" : "Completion"}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 [&>div]:bg-indigo-600 dark:[&>div]:bg-indigo-500" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {isRtl
                ? `أنجزت ${percentage}% من متطلباتك لهذا الفصل. استمر في العمل الرائع!`
                : `You've completed ${percentage}% of your requirements this semester. Keep up the great work!`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
