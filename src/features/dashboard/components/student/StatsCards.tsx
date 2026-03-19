"use client";

import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Briefcase,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { StatCard } from "@/components/common/StatCard";
import { useStudentStats } from "@/features/dashboard/hooks/useStudentStats";

export default function StatsCards() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const { stats, loading, sessionProgress, requestApprovalRate } = useStudentStats();

  const statItems = [
    {
      label: t.totalRequests,
      value: stats.totalRequests,
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      progress: requestApprovalRate,
    },
    {
      label: t.pendingRequests,
      value: stats.pendingRequests,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/30",
    },
    {
      label: t.approvedRequests,
      value: stats.approvedRequests,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
    },
    {
      label: t.totalSessions,
      value: `${stats.completedSessions}/${stats.totalSessions}`,
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      progress: sessionProgress,
    },
    {
      label: t.totalCases,
      value: stats.totalCases,
      icon: Briefcase,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/30",
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
          label={item.label}
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