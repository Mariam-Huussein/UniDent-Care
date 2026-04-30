"use client";

import { Pie, PieChart, Cell } from "recharts";
import { useStudentStats } from "@/features/dashboard/hooks/useStudentStats";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

export default function RequestsAnalytics() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const { stats, loading } = useStudentStats();

  const data = [
    { name: "Approved", value: stats.approvedRequests, color: "var(--chart-1)" },
    { name: "Pending", value: stats.pendingRequests, color: "var(--chart-2)" },
    { name: "Rejected", value: stats.rejectedRequests, color: "var(--chart-3)" },
  ].filter(item => item.value > 0);

  // Chart config
  const chartConfig = {
    Approved: {
      label: isRtl ? "مقبول" : "Approved",
      color: "var(--chart-1)",
    },
    Pending: {
      label: isRtl ? "قيد الانتظار" : "Pending",
      color: "var(--chart-2)",
    },
    Rejected: {
      label: isRtl ? "مرفوض" : "Rejected",
      color: "var(--chart-3)",
    },
  };

  return (
    <Card className="flex flex-col h-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-lg" dir={isRtl ? "rtl" : "ltr"}>
      <CardHeader className="items-center pb-2 pt-6 px-6">
        <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{isRtl ? "إحصائيات الطلبات" : "Requests Analytics"}</CardTitle>
        <CardDescription className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{isRtl ? "حالة طلباتك الحالية" : "Current status of your requests"}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-6 px-6 flex flex-col justify-center">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="w-40 h-40 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-indigo-500 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-slate-400 font-medium">
            {isRtl ? "لا توجد طلبات لعرضها" : "No requests to display"}
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[220px] w-full">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                cornerRadius={6}
                strokeWidth={0}
                className="stroke-transparent"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} className="pt-8 gap-6 text-sm font-medium" />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
