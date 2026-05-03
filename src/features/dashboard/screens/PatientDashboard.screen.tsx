"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/utils/api";
import { motion } from "framer-motion";
import { UpcomingAppointments } from "@/features/dashboard/components/patient/UpcomingAppointments";
import { RecentCases } from "@/features/dashboard/components/patient/RecentCases";
import { DashboardCharts } from "@/features/dashboard/components/patient/DashboardCharts";
import PatientCalendarWidget from "@/features/dashboard/components/patient/PatientCalendarWidget";
import { generatePatientDashboardData, DashboardData, SessionDto } from "@/services/PatientDashboardAnalytics";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function PatientDashboardScreen() {
  const patientId = useSelector((state: RootState) => state.auth.user?.publicId);
  const { language } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);
  const [rawSessions, setRawSessions] = useState<SessionDto[]>([]);
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

        setRawSessions(sessions);

        // --- Fetch Assigned User Names ---
        const studentIds = [...new Set(cases.map((c: any) => c.assignedStudentId).filter((id: any) => !!id))];
        const doctorIds = [...new Set(cases.map((c: any) => c.assignedDoctorId).filter((id: any) => !!id))];
        
        const userNamesMap: Record<string, string> = {};
        
        await Promise.all([
          ...studentIds.map(async (id: any) => {
            try {
              const res = await api.get(`/Students/${id}`);
              if (res?.data?.data?.fullName) {
                userNamesMap[id] = res.data.data.fullName;
              }
            } catch (e) { console.error(`Error fetching student ${id}`, e); }
          }),
          ...doctorIds.map(async (id: any) => {
            try {
              const res = await api.get(`/Doctors/${id}`);
              if (res?.data?.data?.fullName) {
                userNamesMap[id] = res.data.data.fullName;
              }
            } catch (e) { console.error(`Error fetching doctor ${id}`, e); }
          })
        ]);

        console.log('User Names Map:', userNamesMap);

        const dashboardData = generatePatientDashboardData(cases, sessions, upcomingSessions, allDiagnoses, userNamesMap);
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
        <DashboardCharts charts={data.charts} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UpcomingAppointments upcomingSessions={data.upcomingSessions} />
        <RecentCases recentActivity={data.recentActivity} />
      </motion.div>

      {/* Schedule Calendar */}
      <motion.div variants={itemVariants} className="w-full">
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-1000" />
          <div className="relative w-full rounded-2xl p-2 md:p-6 overflow-hidden">
            <div className="overflow-x-auto lg:overflow-visible">
              <div className="min-w-[800px] lg:min-w-full min-h-[650px]">
                <PatientCalendarWidget sessions={rawSessions} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
