"use client";

import { motion } from "framer-motion";
import StatsCards from "@/features/dashboard/components/student/StatsCards";
import RequestsAnalytics from "@/features/dashboard/components/student/RequestsAnalytics";
import AcademicProgress from "@/features/dashboard/components/student/AcademicProgress";
import CalendarWidget from "@/features/dashboard/components/student/CalendarWidget";
import MyCurrentCases from "@/features/dashboard/components/student/MyCurrentCases";
import MyRequests from "@/features/dashboard/components/student/MyRequests";
import { useStudentDashboardData } from "@/features/dashboard/hooks/useStudentDashboardData";
import { containerVariants, itemVariants } from "@/lib/animations";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { HandGrabIcon } from "lucide-react";

export default function StudentDashboardScreen() {
    const { language } = useLanguage();
    const isRtl = language === "ar";
    const { profile } = useStudentDashboardData();
    const firstName = profile.data?.data?.fullName?.split(" ")[0] || (isRtl ? "طبيب" : "Doctor");

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            <motion.div
                className="p-4 md:p-8 lg:p-10 space-y-8 max-w-[1600px] mx-auto w-full font-['IBM_Plex_Sans_Arabic']"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                dir={isRtl ? "rtl" : "ltr"}
            >
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                            {isRtl ? `أهلاً بك مجدداً ${firstName}! 👋` : `Welcome back, ${firstName}! 👋`}
                        </h1>
                    </div>
                </header>

                {/* Row 1: Stats Cards */}
                <motion.div variants={itemVariants} className="z-10">
                    <StatsCards />
                </motion.div>

                {/* Row 2: Focus & Analytics */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 xl:grid-cols-4 gap-6"
                >
                    {/* Left: My Current Cases & My Requests */}
                    <div className="xl:col-span-2 flex flex-col gap-6 h-full">
                        <div className="flex-1 min-h-[250px]">
                            <MyCurrentCases />
                        </div>
                        <div className="flex-1 min-h-[250px]">
                            <MyRequests />
                        </div>
                    </div>

                    {/* Right: Analytics & Progress */}
                    <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6 h-full">
                        <div className="flex-1 min-h-[200px]">
                            <AcademicProgress />
                        </div>
                        <div className="flex-1 min-h-[200px]">
                            <RequestsAnalytics />
                        </div>
                    </div>
                </motion.div>

                {/* Row 3: Calendar Section */}
                <motion.div variants={itemVariants} className="w-full">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/10 to-blue-500/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-1000"></div>

                        <div className="relative w-full rounded-2xl p-2 md:p-6 overflow-hidden">
                            <div className="overflow-x-auto lg:overflow-visible">
                                <div className="min-w-[800px] lg:min-w-full min-h-[650px]">
                                    <CalendarWidget />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}