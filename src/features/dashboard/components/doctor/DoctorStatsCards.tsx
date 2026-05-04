"use client";

import { motion } from "framer-motion";
import {
    FolderOpen,
    Clock,
    AlertCircle,
    CalendarDays,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface DoctorStatsCardsProps {
    totalCases: number;
    pendingRequests: number;
    toEvaluate: number;
    todaySessions: number;
    loading?: boolean;
}

const cards = [
    {
        key: "totalCases",
        labelEn: "Total Cases",
        labelAr: "إجمالي الحالات",
        icon: FolderOpen,
        gradient: "from-blue-600 to-indigo-600",
        glow: "shadow-blue-500/20",
        ring: "ring-blue-100 dark:ring-blue-900/30",
        bg: "bg-blue-50/60 dark:bg-blue-900/20",
        textGrad: "from-blue-600 to-indigo-500",
    },
    {
        key: "pendingRequests",
        labelEn: "Pending Requests",
        labelAr: "طلبات معلقة",
        icon: Clock,
        gradient: "from-amber-500 to-orange-500",
        glow: "shadow-amber-500/20",
        ring: "ring-amber-100 dark:ring-amber-900/30",
        bg: "bg-amber-50/60 dark:bg-amber-900/20",
        textGrad: "from-amber-600 to-orange-500",
    },
    {
        key: "toEvaluate",
        labelEn: "To Evaluate",
        labelAr: "تحتاج تقييم",
        icon: AlertCircle,
        gradient: "from-rose-600 to-red-500",
        glow: "shadow-rose-500/20",
        ring: "ring-rose-100 dark:ring-rose-900/30",
        bg: "bg-rose-50/60 dark:bg-rose-900/20",
        textGrad: "from-rose-600 to-red-500",
    },
    {
        key: "todaySessions",
        labelEn: "Today's Agenda",
        labelAr: "مواعيد اليوم",
        icon: CalendarDays,
        gradient: "from-violet-600 to-purple-600",
        glow: "shadow-violet-500/20",
        ring: "ring-violet-100 dark:ring-violet-900/30",
        bg: "bg-violet-50/60 dark:bg-violet-900/20",
        textGrad: "from-violet-600 to-purple-500",
    },
] as const;

const SkeletonCard = () => (
    <div className="relative overflow-hidden rounded-3xl p-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-lg animate-pulse">
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-full mb-4" />
        <div className="h-9 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
        <div className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700" />
    </div>
);

export function DoctorStatsCards({
    totalCases,
    pendingRequests,
    toEvaluate,
    todaySessions,
    loading = false,
}: DoctorStatsCardsProps) {
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const values: Record<string, number> = {
        totalCases,
        pendingRequests,
        toEvaluate,
        todaySessions,
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {cards.map((c) => <SkeletonCard key={c.key} />)}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5" dir={isRtl ? "rtl" : "ltr"}>
            {cards.map((card, idx) => {
                const Icon = card.icon;
                const value = values[card.key];
                const label = isRtl ? card.labelAr : card.labelEn;
                return (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.07 }}
                        className={`relative overflow-hidden rounded-3xl p-6 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-lg hover:shadow-xl ${card.glow} transition-all duration-300 group`}
                    >
                        {/* Background glow blob */}
                        <div
                            className={`absolute -right-6 -top-6 w-28 h-28 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity duration-500`}
                        />

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    {label}
                                </p>
                                <h3
                                    className={`text-4xl font-black bg-gradient-to-br ${card.textGrad} bg-clip-text text-transparent leading-none`}
                                >
                                    {value}
                                </h3>
                            </div>

                            <div
                                className={`p-3.5 rounded-2xl ring-2 ${card.ring} ${card.bg} group-hover:scale-110 transition-transform duration-300`}
                            >
                                <div className={`bg-gradient-to-br ${card.gradient} p-0.5 rounded-xl`}>
                                    <Icon size={20} className="text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Bottom highlight bar */}
                        <div
                            className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${card.gradient} group-hover:w-full transition-all duration-500 rounded-b-3xl`}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}
