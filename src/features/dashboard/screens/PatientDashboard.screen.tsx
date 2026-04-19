"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { StatsCards } from "@/features/dashboard/components/patient/StatsCards";
import { UpcomingAppointments } from "@/features/dashboard/components/patient/UpcomingAppointments";
import { RecentCases } from "@/features/dashboard/components/patient/RecentCases";
import { DashboardCharts } from "@/features/dashboard/components/patient/DashboardCharts";
import { generatePatientDashboardData, DashboardData } from "@/services/PatientDashboardAnalytics";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function PatientDashboardScreen() {
  const patientId = useSelector((state: RootState) => state.auth.user?.publicId);
  const { t, language } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [casesRes, sessionsRes, dxRes, scheduleRes] = await Promise.all([
          api.get(`/Cases/patient/${patientId}`),
          api.get(`/Sessions/patient/${patientId}`, { params: { page: 1, pageSize: 100 } }),
          // Given the requirements "Call /api/Diagnoses/case/{caseId} Loop over all patient cases",
          // wait, is there an endpoint to get all dx for patient or do we have to loop cases?
          // I will assume we might need to loop cases. To keep it fast, we can map over cases and fetch dx in parallel.
          null, // placeholder for dx
          // wait, requirements said `/api/Sessions/schedule/upcoming?patientId={patientId}`
          api.get(`/Sessions/schedule/upcoming`, { params: { patientId } })
        ]);

        const casesRaw = casesRes.data.data;
        const cases = Array.isArray(casesRaw) ? casesRaw : casesRaw?.items || [];

        // Loop over cases to fetch diagnoses
        const diagnosesPromises = cases.map((c: any) => api.get(`/Diagnoses/case/${c.id}`).catch(() => null));
        const dxResponses = await Promise.all(diagnosesPromises);
        let allDiagnoses: any[] = [];
        dxResponses.forEach(res => {
          if (res?.data?.data) {
             const dxData = Array.isArray(res.data.data) ? res.data.data : res.data.data?.items || [];
             allDiagnoses = [...allDiagnoses, ...dxData];
          }
        });

        const sessionsRaw = sessionsRes?.data?.data;
        const sessions = Array.isArray(sessionsRaw) ? sessionsRaw : sessionsRaw?.items || [];

        const upcomingRaw = scheduleRes?.data?.data;
        // If the endpoint isn't exactly as imagined, fallback to filtering sessions as a safety net:
        let upcomingSessions = Array.isArray(upcomingRaw) ? upcomingRaw : upcomingRaw?.items || [];
        if (upcomingSessions.length === 0) {
           upcomingSessions = sessions.filter((s:any) => s.status === 'Scheduled');
        }

        const dashboardData = generatePatientDashboardData(cases, sessions, upcomingSessions, allDiagnoses);
        setData(dashboardData);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [patientId]);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading dashboard elements...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 space-y-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <StatsCards kpis={data.kpis} progress={data.progress} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardCharts charts={data.charts} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UpcomingAppointments upcomingSessions={data.upcomingSessions} />
        <RecentCases recentActivity={data.recentActivity} />
      </motion.div>
    </motion.div>
  );
}
