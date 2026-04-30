"use client";

import { useState } from "react";
import { useStudentDashboardData } from "@/features/dashboard/hooks/useStudentDashboardData";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, User, Calendar, XCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useRouter } from "next/navigation";
import MyCustomButton from "@/components/ui/MyCustomButton";
import { cancelCaseRequest } from "@/features/cases/server/caseRequest.action";
import toast from "react-hot-toast";

export default function MyRequests() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const router = useRouter();
  const { myRequests } = useStudentDashboardData();
  const { data, isLoading, isError, refetch } = myRequests;

  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (isError) {
    return (
      <Card className="h-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardContent className="flex items-center justify-center h-full p-8 text-destructive">
          {isRtl ? "حدث خطأ في تحميل الطلبات" : "Failed to load your requests"}
        </CardContent>
      </Card>
    );
  }

  // Filter for pending requests
  const pendingRequests = data?.data?.items?.filter(item => item.status === "Pending") || [];

  const handleCancelRequest = async (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    setCancellingId(requestId);
    try {
      const res = await cancelCaseRequest(requestId);
      if (res.success) {
        toast.success(isRtl ? "تم إلغاء الطلب بنجاح" : "Request cancelled successfully");
        refetch();
      } else {
        toast.error(res.message || (isRtl ? "فشل في إلغاء الطلب" : "Failed to cancel request"));
      }
    } catch (err: any) {
      toast.error(err.message || (isRtl ? "فشل في إلغاء الطلب" : "Failed to cancel request"));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Card className="h-full flex flex-col rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-lg relative overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      <div className="absolute top-0 right-0 h-1 w-full bg-amber-500/80" />

      <CardHeader className="pb-4 pt-6 px-6">
        <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <FileText className="w-4 h-4" />
          {isRtl ? "طلباتك الحالية" : "My Requests"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-6 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-28 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
            <div className="h-28 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
        ) : pendingRequests.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center h-[200px] text-slate-400 text-center">
            <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-3">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-medium text-sm">{isRtl ? "لا توجد طلبات حالية" : "No current requests"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => router.push(`/cases/${request.patientCasePublicId}`)}
                className="group cursor-pointer flex flex-col gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {request.patientName}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-6 rtl:mr-6">
                      {isRtl ? "دكتور:" : "Dr:"} {request.doctorName}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-6 rtl:mr-6">
                      {isRtl ? "وصف الحالة:" : "Case description:"} {request.description}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {format(new Date(request.createAt), "MMM d, yyyy", { locale: isRtl ? ar : enUS })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <MyCustomButton
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/cases/${request.patientCasePublicId}`);
                      }}
                      className="flex-1 sm:flex-none p-2.5 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </MyCustomButton>
                    <MyCustomButton
                      variant="danger-outline"
                      loading={cancellingId === request.id}
                      onClick={(e) => handleCancelRequest(e, request.id)}
                      className="flex-1 sm:flex-none p-2.5 text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </MyCustomButton>
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
