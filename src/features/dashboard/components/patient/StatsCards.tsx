"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/utils/api";
import { Activity, Calendar, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { StatCard } from "@/components/common/StatCard";

interface Stats {
  activeCases: number;
  upcomingSessions: number;
  completedTreatments: number;
}

export function StatsCards() {
  const patientId = useSelector((state: RootState) => state.auth.user?.publicId);
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const [stats, setStats] = useState<Stats>({
    activeCases: 0,
    upcomingSessions: 0,
    completedTreatments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const [sessionsRes, casesRes] = await Promise.all([
          api.get(`/Sessions/patient/${patientId}`, { params: { page: 1, pageSize: 100 } }),
          api.get(`/Cases/patient/${patientId}`)
        ]);

        const sessionsData = Array.isArray(sessionsRes.data.data) ? sessionsRes.data.data : (sessionsRes.data.data?.items || []);
        const casesData = Array.isArray(casesRes.data.data) ? casesRes.data.data : (casesRes.data.data?.items || []);

        setStats({
          upcomingSessions: sessionsData.filter((s: any) => s.status === "Scheduled").length,
          activeCases: casesData.filter((c: any) => c.status === "In Progress").length,
          completedTreatments: casesData.filter((c: any) => c.status === "Completed").length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [patientId]);

  const statItems = [
    {
      label: t.dashStatsActive,
      value: stats.activeCases,
      icon: Activity,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      label: t.dashStatsUpcoming,
      value: stats.upcomingSessions,
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
    },
    {
      label: t.dashStatsCompleted,
      value: stats.completedTreatments,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-1 transition-colors duration-300`} dir={isRtl ? 'rtl' : 'ltr'}>
      {statItems.map((item, index) => (
        <StatCard
          key={index}
          label={item.label}
          value={item.value}
          icon={item.icon}
          color={item.color}
          bgColor={item.bgColor}
          loading={loading}
        />
      ))}
    </div>
  );
}