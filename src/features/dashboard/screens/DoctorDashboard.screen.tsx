"use client";

import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import { RefreshCw, Stethoscope } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Cookies from "js-cookie";
import { format } from "date-fns";

import {
    doctorDashboardService,
    SessionDto,
    CaseRequest,
} from "../services/doctorDashboardService";
import { containerVariants, itemVariants } from "@/lib/animations";

import { DoctorStatsCards } from "../components/doctor/DoctorStatsCards";
import { DoctorCalendar } from "../components/doctor/DoctorCalendar";
import { DayDetailDrawer } from "../components/doctor/DayDetailDrawer";
import { DoctorBottomSection } from "../components/doctor/DoctorBottomSection";

export default function DoctorDashboardScreen() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const doctorId =
        (user as any)?.publicId ??
        (user as any)?.id ??
        Cookies.get("user_id");

    const firstName =
        (user as any)?.fullName?.split(" ")[0] ||
        (isRtl ? "دكتور" : "Doctor");

    // ── Stats state ──
    const [totalCases, setTotalCases] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);
    const [toEvaluate, setToEvaluate] = useState(0);
    const [todaySessions, setTodaySessions] = useState(0);
    const [statsLoading, setStatsLoading] = useState(true);

    // ── Calendar / bottom section state ──
    const [allSessions, setAllSessions] = useState<SessionDto[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // ── Drawer state ──
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSessions, setSelectedSessions] = useState<SessionDto[]>([]);
    const [selectedPendingReqs, setSelectedPendingReqs] = useState<CaseRequest[]>([]);

    // ── Filters (passed down to calendar for visual reference) ──
    const [filters, setFilters] = useState({ student: "", status: "" });

    // ── Fetch stats ──
    const fetchStats = useCallback(async () => {
        if (!doctorId) return;
        setStatsLoading(true);
        try {
            const [casesRes, reqsRes, evalRes, schedRes] = await Promise.all([
                doctorDashboardService.getDoctorCases(doctorId, { pageSize: 1 }),
                doctorDashboardService.getDoctorRequests({ status: 1, pageSize: 1 }),
                doctorDashboardService.getSessionsToEvaluate({ pageSize: 1 }),
                doctorDashboardService.getScheduleSessions({ pageSize: 500 }),
            ]);

            setTotalCases(casesRes?.data?.totalCount ?? 0);
            setPendingRequests(reqsRes?.totalCount ?? 0);
            setToEvaluate(evalRes?.totalCount ?? 0);

            // Count today's sessions client-side
            const today = format(new Date(), "yyyy-MM-dd");
            const todayCount = (schedRes?.items ?? []).filter(
                (s: SessionDto) => s.scheduledAt?.startsWith(today)
            ).length;
            setTodaySessions(todayCount);

            // Also store sessions for bottom section
            setAllSessions(schedRes?.items ?? []);
        } catch (err) {
            console.error("Stats fetch error:", err);
        } finally {
            setStatsLoading(false);
            setSessionsLoading(false);
        }
    }, [doctorId]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleRefresh = () => {
        setRefreshTrigger((t) => t + 1);
        fetchStats();
    };

    const handleDayClick = (date: string, sessions: SessionDto[], pendingReqs: CaseRequest[]) => {
        setSelectedDate(date);
        setSelectedSessions(sessions);
        setSelectedPendingReqs(pendingReqs);
        setDrawerOpen(true);
    };

    const now = new Date();
    const todayStr = isRtl
        ? now.toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        : now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    return (
        <motion.div
            className="space-y-8 max-w-[1400px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            dir={isRtl ? "rtl" : "ltr"}
        >
            {/* ── Header ── */}
            <motion.div variants={itemVariants} className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <Stethoscope size={26} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
                            {isRtl
                                ? `أهلاً بك، د. ${firstName}! 👋`
                                : `Welcome back, Dr. ${firstName}! 👋`}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {todayStr}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-200 dark:border-slate-700 transition-all duration-200"
                    title={isRtl ? "تحديث" : "Refresh"}
                >
                    <RefreshCw size={15} className={statsLoading ? "animate-spin" : ""} />
                    <span className="hidden sm:inline">{isRtl ? "تحديث" : "Refresh"}</span>
                </button>
            </motion.div>

            {/* ── Stats Cards ── */}
            <motion.div variants={itemVariants}>
                <DoctorStatsCards
                    totalCases={totalCases}
                    pendingRequests={pendingRequests}
                    toEvaluate={toEvaluate}
                    todaySessions={todaySessions}
                    loading={statsLoading}
                />
            </motion.div>

            {/* ── Calendar ── */}
            <motion.div variants={itemVariants}>
                <DoctorCalendar
                    onDayClick={handleDayClick}
                    filterStudent={filters.student}
                    filterStatus={filters.status}
                    onFilterChange={setFilters}
                    refreshTrigger={refreshTrigger}
                />
            </motion.div>

            {/* ── Bottom Section ── */}
            <motion.div variants={itemVariants}>
                <DoctorBottomSection
                    sessions={allSessions}
                    loading={sessionsLoading}
                />
            </motion.div>

            {/* ── Day Detail Drawer ── */}
            <DayDetailDrawer
                open={drawerOpen}
                date={selectedDate}
                sessions={selectedSessions}
                pendingRequests={selectedPendingReqs}
                onClose={() => setDrawerOpen(false)}
            />
        </motion.div>
    );
}
