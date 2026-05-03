"use client";

import { useStudentDashboardData } from "@/features/dashboard/hooks/useStudentDashboardData";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { StudentDashboardCaseItem } from "@/features/cases/types/studentDashboard.types";
import { useMemo } from "react";

export default function MyCurrentCases() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const router = useRouter();
  const { myCases } = useStudentDashboardData();
  const { data, isLoading, isError } = myCases;

  if (isError) {
    return (
      <Card className="h-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardContent className="flex items-center justify-center h-full p-8 text-destructive">
          {isRtl ? "حدث خطأ في تحميل حالاتك" : "Failed to load your cases"}
        </CardContent>
      </Card>
    );
  }

  // Filter for 'In Progress' status
  const currentCases = useMemo(() => {
    return data?.data?.items?.filter((item: StudentDashboardCaseItem) => item.status === "InProgress") || [];
  }, [data]);

  return (
    <Card className="h-full flex flex-col rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-lg relative overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      <div className="absolute top-0 right-0 h-1 w-full bg-blue-500/80" />

      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <Briefcase className="w-4 h-4" />
          {isRtl ? "حالاتك الحالية" : "My Current Cases"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-6 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
            <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
        ) : currentCases.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center h-[200px] text-slate-400 text-center">
            <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-3">
              <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-medium text-sm">{isRtl ? "لا توجد حالات جارية" : "No in progress cases"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentCases.map((caseItem) => (
              <div
                key={caseItem.id}
                onClick={() => router.push(`/cases/${caseItem.id}`)}
                className="group cursor-pointer flex flex-col gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {caseItem.patientName}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-6 ms-6">
                      {isRtl ? "رقم الهاتف:" : "Phone:"} {caseItem.phone}
                    </span>
                    <span className="text-xs line-clamp-1 font-medium text-slate-500 dark:text-slate-400 ml-6 ms-6">
                      {isRtl ? "نوع الحالة:" : "Type:"} {caseItem?.diagnosisdto?.[0]?.caseTypeName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
