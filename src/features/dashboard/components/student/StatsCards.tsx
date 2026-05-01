"use client";

import { Briefcase, Clock, Percent } from "lucide-react";
import { useStudentStats } from "@/features/dashboard/hooks/useStudentStats";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { StatCard } from "@/components/common/StatCard";

export default function StatsCards() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const { stats, loading } = useStudentStats();

  const acceptanceRate = stats.totalRequests > 0 ? Math.round((stats.approvedRequests / stats.totalRequests) * 100) : 0;

  const statItems = [
    {
      title: isRtl ? "إجمالي الحالات" : "Total Cases",
      value: stats.totalCases,
      icon: Briefcase,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: isRtl ? "طلبات معلقة" : "Pending Requests",
      value: stats.pendingRequests,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      isWarning: true,
    },
    {
      title: isRtl ? "معدل القبول" : "Acceptance Rate",
      value: `${acceptanceRate}%`,
      icon: Percent,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      progress: acceptanceRate,
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1 transition-colors duration-300"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {statItems.map((item, index) => (
        <StatCard
          key={index}
          label={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
          bgColor={item.bgColor}
          loading={loading}
          progress={item.progress}
        />
      ))}
    </div>
  );
}