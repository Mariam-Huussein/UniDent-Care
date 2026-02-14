"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/utils/api";
import { Activity, Calendar, CheckCircle2, Loader2 } from "lucide-react";

interface Stats {
  activeCases: number;
  upcomingSessions: number;
  completedTreatments: number;
}

export function StatsCards() {
  const patientId = useSelector((state: RootState) => state.auth.user?.userId);
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

        const sessionsData = sessionsRes.data.data || [];
        const casesData = casesRes.data.data || [];

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
      label: "Active Cases",
      value: stats.activeCases,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Upcoming Sessions",
      value: stats.upcomingSessions,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Completed",
      value: stats.completedTreatments,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className="relative overflow-hidden group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
              {loading ? (
                <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
              ) : (
                <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
              )}
            </div>
            <div className={`p-3 rounded-xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
          </div>
          
          <div className={`absolute bottom-0 left-0 h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity ${item.color.replace('text', 'bg')}`} />
        </div>
      ))}
    </div>
  );
}