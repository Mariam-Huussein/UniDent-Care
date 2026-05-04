"use client";

import { motion } from "framer-motion";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FileText, Clock, MessageSquare, PieChart as PieChartIcon } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SessionDto, SessionNoteDto } from "../../services/doctorDashboardService";
import { format, parseISO } from "date-fns";

interface DoctorBottomSectionProps {
    sessions: SessionDto[];
    loading?: boolean;
}

const PIE_COLORS = [
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f59e0b", // amber
    "#10b981", // emerald
    "#3b82f6", // blue
    "#f43f5e", // rose
];

function buildCaseTypeData(sessions: SessionDto[]) {
    const counts: Record<string, number> = {};
    sessions.forEach((s) => {
        const key = s.treatmentType || "Other";
        counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({ name, value }));
}

function buildLatestNotes(sessions: SessionDto[]): Array<SessionNoteDto & { sessionId: string; caseId: string; patientName: string | null; treatmentType: string | null }> {
    const notes: Array<SessionNoteDto & { sessionId: string; caseId: string; patientName: string | null; treatmentType: string | null }> = [];
    sessions.forEach((s) => {
        if (s.notes && s.notes.length > 0) {
            s.notes.forEach((n) => {
                notes.push({ ...n, sessionId: s.id, caseId: s.caseId, patientName: s.patientName, treatmentType: s.treatmentType });
            });
        }
    });
    return notes
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
        .slice(0, 8);
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg">
                <p className="text-xs font-black text-slate-700 dark:text-white">{payload[0].name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{payload[0].value} sessions</p>
            </div>
        );
    }
    return null;
};

export function DoctorBottomSection({ sessions, loading = false }: DoctorBottomSectionProps) {
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const pieData = buildCaseTypeData(sessions);
    const latestNotes = buildLatestNotes(sessions);

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[0, 1].map((i) => (
                    <div key={i} className="bg-white/70 dark:bg-slate-900/40 rounded-3xl p-6 animate-pulse h-64" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" dir={isRtl ? "rtl" : "ltr"}>
            {/* ── Pie Chart: Case Type Distribution ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-lg group"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <PieChartIcon size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-800 dark:text-white">
                            {isRtl ? "توزيع نوع الحالات" : "Case Type Distribution"}
                        </h3>
                        <p className="text-xs text-slate-400">
                            {isRtl ? "بناءً على الجلسات" : "Based on sessions"}
                        </p>
                    </div>
                </div>

                {pieData.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-slate-400 text-sm font-semibold">
                        {isRtl ? "لا توجد بيانات" : "No data available"}
                    </div>
                ) : (
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {pieData.map((_, idx) => (
                                        <Cell
                                            key={idx}
                                            fill={PIE_COLORS[idx % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => (
                                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "inherit" }}>
                                            {value}
                                        </span>
                                    )}
                                />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </motion.div>

            {/* ── Latest Notes Panel ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-lg group"
            >
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <MessageSquare size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-800 dark:text-white">
                            {isRtl ? "آخر الملاحظات" : "Latest Notes"}
                        </h3>
                        <p className="text-xs text-slate-400">
                            {isRtl ? "ملاحظات الطلاب على الجلسات" : "Student notes on sessions"}
                        </p>
                    </div>
                </div>

                {latestNotes.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-slate-400 text-sm font-semibold">
                        {isRtl ? "لا توجد ملاحظات حديثة" : "No recent notes"}
                    </div>
                ) : (
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                        {latestNotes.map((note, idx) => (
                            <motion.div
                                key={note.id ?? idx}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex gap-3 p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                            >
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                                    <FileText size={13} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                        {note.treatmentType || (isRtl ? "جلسة" : "Session")}
                                        {note.patientName && (
                                            <span className="text-slate-400 font-normal"> · {note.patientName}</span>
                                        )}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                        {note.content || (isRtl ? "لا يوجد محتوى" : "No content")}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1 text-slate-400">
                                        <Clock size={10} />
                                        <span className="text-[10px]">
                                            {(() => {
                                                try {
                                                    return format(parseISO(note.createdAt), "MMM d, h:mm a");
                                                } catch {
                                                    return note.createdAt;
                                                }
                                            })()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
