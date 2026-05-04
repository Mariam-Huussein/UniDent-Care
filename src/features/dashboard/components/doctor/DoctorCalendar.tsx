"use client";

import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DatesSetArg, EventInput } from "@fullcalendar/core";
import { Search, Filter, RefreshCw } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
    doctorDashboardService,
    SessionDto,
    CaseRequest,
} from "../../services/doctorDashboardService";
import { format, parseISO, isSameDay } from "date-fns";

// Priority order: urgent > action > scheduled > completed
type DayStatus = "urgent" | "action" | "scheduled" | "completed";

interface DayMap {
    [dateKey: string]: {
        status: DayStatus;
        sessions: SessionDto[];
        pendingReqs: CaseRequest[];
    };
}

interface DoctorCalendarProps {
    onDayClick: (date: string, sessions: SessionDto[], pendingReqs: CaseRequest[]) => void;
    filterStudent?: string;
    filterStatus?: string;
    onFilterChange: (filters: { student: string; status: string }) => void;
    refreshTrigger?: number;
}

const STATUS_OPTIONS = [
    { value: "", labelEn: "All", labelAr: "الكل" },
    { value: "Scheduled", labelEn: "Scheduled", labelAr: "مجدولة" },
    { value: "Done", labelEn: "Completed", labelAr: "منتهية" },
    { value: "pending", labelEn: "Action Required", labelAr: "تحتاج إجراء" },
    { value: "urgent", labelEn: "Urgent", labelAr: "عاجل" },
];

// Map DayStatus to FullCalendar event color
const STATUS_COLORS: Record<DayStatus, { bg: string; border: string; text: string; dot: string }> = {
    urgent: {
        bg: "#fef2f2",
        border: "#ef4444",
        text: "#dc2626",
        dot: "bg-red-500 shadow-red-500/50",
    },
    action: {
        bg: "#fffbeb",
        border: "#f59e0b",
        text: "#d97706",
        dot: "bg-amber-500 shadow-amber-500/50",
    },
    scheduled: {
        bg: "#eff6ff",
        border: "#3b82f6",
        text: "#2563eb",
        dot: "bg-blue-500 shadow-blue-500/50",
    },
    completed: {
        bg: "#f0fdf4",
        border: "#22c55e",
        text: "#16a34a",
        dot: "bg-emerald-500 shadow-emerald-500/50",
    },
};

function getDateKey(dateStr: string) {
    return format(parseISO(dateStr), "yyyy-MM-dd");
}

function determineDayStatus(sessions: SessionDto[], hasPendingReqs: boolean): DayStatus {
    const hasUrgent = sessions.some(
        (s) => s.status === "Done" && !s.evaluteDoctorId
    );
    if (hasUrgent) return "urgent";
    if (hasPendingReqs) return "action";
    const allDoneEvaluated =
        sessions.length > 0 &&
        sessions.every((s) => s.status === "Done" && s.evaluteDoctorId);
    if (allDoneEvaluated) return "completed";
    const hasScheduled = sessions.some((s) => s.status === "Scheduled");
    if (hasScheduled) return "scheduled";
    return "scheduled";
}

export function DoctorCalendar({
    onDayClick,
    filterStudent,
    filterStatus,
    onFilterChange,
    refreshTrigger,
}: DoctorCalendarProps) {
    const { language } = useLanguage();
    const isRtl = language === "ar";
    const calendarRef = useRef<FullCalendar>(null);

    const [allSessions, setAllSessions] = useState<SessionDto[]>([]);
    const [pendingRequests, setPendingRequests] = useState<CaseRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentFilter, setStudentFilter] = useState(filterStudent ?? "");
    const [statusFilter, setStatusFilter] = useState(filterStatus ?? "");

    // Build events for FullCalendar
    const buildDayMap = (): DayMap => {
        const map: DayMap = {};

        // Group sessions by date
        allSessions.forEach((s) => {
            const dk = getDateKey(s.scheduledAt);
            if (!map[dk]) map[dk] = { status: "scheduled", sessions: [], pendingReqs: [] };
            map[dk].sessions.push(s);
        });

        // Attach pending requests by their createAt date
        pendingRequests.forEach((r) => {
            const dk = getDateKey(r.createAt);
            if (!map[dk]) map[dk] = { status: "scheduled", sessions: [], pendingReqs: [] };
            map[dk].pendingReqs.push(r);
        });

        // Determine final status for each day
        Object.keys(map).forEach((dk) => {
            const d = map[dk];
            d.status = determineDayStatus(d.sessions, d.pendingReqs.length > 0);
        });

        return map;
    };

    const buildEvents = (): EventInput[] => {
        const dayMap = buildDayMap();
        const events: EventInput[] = [];

        Object.entries(dayMap).forEach(([dateKey, dayData]) => {
            let { sessions } = dayData;

            // Apply client-side filters
            if (studentFilter.trim()) {
                const q = studentFilter.toLowerCase();
                sessions = sessions.filter((s) =>
                    s.studentName?.toLowerCase().includes(q) ||
                    s.patientName?.toLowerCase().includes(q)
                );
            }
            if (statusFilter === "urgent") {
                const hasUrgent = sessions.some((s) => s.status === "Done" && !s.evaluteDoctorId);
                if (!hasUrgent && dayData.pendingReqs.length === 0) return;
            } else if (statusFilter === "pending") {
                if (dayData.pendingReqs.length === 0) return;
            } else if (statusFilter === "Scheduled") {
                sessions = sessions.filter((s) => s.status === "Scheduled");
                if (sessions.length === 0) return;
            } else if (statusFilter === "Done") {
                sessions = sessions.filter((s) => s.status === "Done");
                if (sessions.length === 0) return;
            }

            const colors = STATUS_COLORS[dayData.status];
            const count = sessions.length + dayData.pendingReqs.length;

            events.push({
                id: `day-${dateKey}`,
                date: dateKey,
                allDay: true,
                title: `${count}`,
                backgroundColor: colors.bg,
                borderColor: colors.border,
                textColor: colors.text,
                extendedProps: {
                    status: dayData.status,
                    sessions: dayData.sessions,
                    pendingReqs: dayData.pendingReqs,
                    dateKey,
                },
            });
        });

        return events;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sessionsRes, reqsRes] = await Promise.all([
                doctorDashboardService.getScheduleSessions({ pageSize: 500 }),
                doctorDashboardService.getDoctorRequests({ status: 1, pageSize: 200 }),
            ]);
            setAllSessions(sessionsRes?.items ?? []);
            setPendingRequests(reqsRes?.items ?? []);
        } catch (err) {
            console.error("Calendar fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const handleDateClick = (arg: DateClickArg) => {
        const dayMap = buildDayMap();
        const dk = format(arg.date, "yyyy-MM-dd");
        const dayData = dayMap[dk];
        onDayClick(dk, dayData?.sessions ?? [], dayData?.pendingReqs ?? []);
    };

    const handleEventClick = (info: any) => {
        const { dateKey, sessions, pendingReqs } = info.event.extendedProps;
        onDayClick(dateKey, sessions, pendingReqs);
    };

    const events = buildEvents();

    return (
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl shadow-lg overflow-hidden">
            {/* Filter bar */}
            <div
                className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3"
                dir={isRtl ? "rtl" : "ltr"}
            >
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Filter size={15} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {isRtl ? "الفلاتر" : "Filters"}
                    </span>
                </div>

                {/* Student search */}
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                    <Search
                        size={14}
                        className="absolute top-1/2 -translate-y-1/2 text-slate-400"
                        style={{ [isRtl ? "right" : "left"]: "10px" }}
                    />
                    <input
                        type="text"
                        value={studentFilter}
                        onChange={(e) => {
                            setStudentFilter(e.target.value);
                            onFilterChange({ student: e.target.value, status: statusFilter });
                        }}
                        placeholder={isRtl ? "اسم الطالب..." : "Student name..."}
                        className={`w-full h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${isRtl ? "pr-8 pl-3" : "pl-8 pr-3"}`}
                    />
                </div>

                {/* Status chips */}
                <div className="flex items-center gap-2 flex-wrap">
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                setStatusFilter(opt.value);
                                onFilterChange({ student: studentFilter, status: opt.value });
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200 ${
                                statusFilter === opt.value
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                    : "bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300"
                            }`}
                        >
                            {isRtl ? opt.labelAr : opt.labelEn}
                        </button>
                    ))}
                </div>

                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="ms-auto p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    title={isRtl ? "تحديث" : "Refresh"}
                >
                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Legend */}
            <div className="px-6 pt-3 pb-0 flex flex-wrap gap-4" dir={isRtl ? "rtl" : "ltr"}>
                {(["urgent", "action", "scheduled", "completed"] as DayStatus[]).map((s) => (
                    <div key={s} className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${STATUS_COLORS[s].dot}`} />
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {s === "urgent"
                                ? isRtl ? "عاجل" : "Urgent"
                                : s === "action"
                                ? isRtl ? "يحتاج إجراء" : "Action Required"
                                : s === "scheduled"
                                ? isRtl ? "مجدولة" : "Scheduled"
                                : isRtl ? "منتهية" : "Completed"}
                        </span>
                    </div>
                ))}
            </div>

            {/* Calendar */}
            <div className="p-4 doctor-calendar-wrap">
                <style>{`
                    .doctor-calendar-wrap .fc { font-family: inherit; }
                    .doctor-calendar-wrap .fc-toolbar-title { font-size: 1.1rem; font-weight: 800; }
                    .doctor-calendar-wrap .fc-button-primary { 
                        background: transparent !important; 
                        border-color: #e2e8f0 !important; 
                        color: #64748b !important;
                        border-radius: 10px !important;
                        font-size: 0.8rem !important;
                        font-weight: 700 !important;
                    }
                    .doctor-calendar-wrap .fc-button-primary:hover { 
                        background: #f1f5f9 !important; 
                        color: #6366f1 !important;
                    }
                    .doctor-calendar-wrap .fc-daygrid-day { cursor: pointer; transition: background 0.15s; }
                    .doctor-calendar-wrap .fc-daygrid-day:hover { background: #f8fafc !important; }
                    .dark .doctor-calendar-wrap .fc-daygrid-day:hover { background: rgba(255,255,255,0.03) !important; }
                    .doctor-calendar-wrap .fc-event { 
                        border-radius: 8px !important; 
                        border-width: 1.5px !important;
                        font-size: 0.72rem !important; 
                        font-weight: 800 !important;
                        cursor: pointer;
                        padding: 1px 6px !important;
                    }
                    .dark .doctor-calendar-wrap .fc-daygrid-day-number { color: #94a3b8 !important; }
                    .dark .doctor-calendar-wrap .fc-col-header-cell-cushion { color: #64748b !important; }
                    .dark .doctor-calendar-wrap .fc-toolbar-title { color: #e2e8f0 !important; }
                    .dark .doctor-calendar-wrap .fc-scrollgrid { border-color: #1e293b !important; }
                    .dark .doctor-calendar-wrap td, .dark .doctor-calendar-wrap th { border-color: #1e293b !important; }
                `}</style>

                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                            <p className="text-sm font-semibold text-slate-400">
                                {isRtl ? "جاري تحميل التقويم..." : "Loading calendar..."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: isRtl ? "next,prev" : "prev,next",
                            center: "title",
                            right: "today",
                        }}
                        direction={isRtl ? "rtl" : "ltr"}
                        locale={isRtl ? "ar" : "en"}
                        height="auto"
                        dayMaxEvents={2}
                        moreLinkText={isRtl ? "المزيد" : "more"}
                        eventContent={(arg) => {
                            const status = arg.event.extendedProps.status as DayStatus;
                            const colors = STATUS_COLORS[status];
                            const count = arg.event.title;
                            return (
                                <div className="flex items-center gap-1 px-1.5 py-0.5">
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`}
                                    />
                                    <span style={{ color: colors.text, fontWeight: 800, fontSize: "0.72rem" }}>
                                        {count} {arg.event.extendedProps.sessions?.length === 1 ? (isRtl ? "جلسة" : "session") : (isRtl ? "جلسات" : "sessions")}
                                    </span>
                                </div>
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );
}
