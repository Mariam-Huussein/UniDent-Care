"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquareText } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSessionsByCase } from "@/features/cases/server/sessions.action";
import { TimelineSessionItem } from "@/features/session/types/Sessions.types";
import SessionCard from "../../../../session/components/SessionTimeLine/SessionCard";

/* ─────────────────────────────────────────────────────────── */
/*  Skeleton                                                   */
/* ─────────────────────────────────────────────────────────── */
function TimelineSkeleton() {
    return (
        <div className="space-y-0">
            {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-4 mb-8">
                    {/* Node */}
                    <div className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
                        {i < 2 && (
                            <div className="w-px flex-1 min-h-[32px] mt-2 bg-slate-100 dark:bg-slate-800" />
                        )}
                    </div>
                    {/* Card */}
                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3 animate-pulse">
                        <div className="flex gap-2 items-start">
                            <div className="flex-1 space-y-2">
                                <div className="h-3.5 w-36 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                                <div className="h-2.5 w-52 bg-slate-50 dark:bg-slate-800/50 rounded" />
                            </div>
                            <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        </div>
                        <div className="h-4 w-2/3 bg-slate-50 dark:bg-slate-800/50 rounded-lg" />
                        <div className="space-y-1.5">
                            <div className="h-3 w-full bg-slate-50 dark:bg-slate-800/50 rounded" />
                            <div className="h-3 w-5/6 bg-slate-50 dark:bg-slate-800/50 rounded" />
                        </div>
                        <div className="flex gap-1.5">
                            {[1, 2, 3].map((j) => (
                                <div
                                    key={j}
                                    className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────── */
/*  Empty state                                               */
/* ─────────────────────────────────────────────────────────── */
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4 ring-1 ring-slate-200 dark:ring-slate-700/50 shadow-inner">
                <MessageSquareText size={24} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-base font-bold text-slate-600 dark:text-slate-300">No completed sessions yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5 max-w-xs leading-relaxed">
                Sessions will appear here once completed. Track your clinical progress over time.
            </p>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────── */
/*  Main component                                            */
/* ─────────────────────────────────────────────────────────── */
export default function ActivityTimeline({ caseId }: { caseId: string }) {
    const role = useSelector((state: RootState) => state.auth.role);
    const [sessions, setSessions] = useState<TimelineSessionItem[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getSessionsByCase(caseId, 1, 100);
            if (res.success && res.data) {
                const done = (res.data.items as TimelineSessionItem[]).filter((s) =>
                    ["done", "completed"].includes(s.status?.toLowerCase())
                );
                setSessions(done);
            }
        } catch (e: any) {
            toast.error(e.message || "Failed to load sessions");
        } finally {
            setLoading(false);
        }
    }, [caseId]);

    useEffect(() => {
        load();
    }, [load]);

    /* ── Loading ── */
    if (loading) return <TimelineSkeleton />;

    /* ── Empty ── */
    if (sessions.length === 0) return <EmptyState />;

    /* ── Data ── */
    const evaluated = sessions.filter(
        (s) => !(s.grade === 0 && !s.doctorNote?.trim())
    ).length;

    return (
        <div>
            {/* ── Feed header ── */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
                        Clinical Sessions Timeline
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {sessions.length} completed &middot; {evaluated} evaluated
                    </p>
                </div>

                {/* Mini progress bar */}
                {sessions.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            {Math.round((evaluated / sessions.length) * 100)}% reviewed
                        </span>
                        <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-linear-to-r from-indigo-400 to-violet-500 transition-all duration-700"
                                style={{ width: `${(evaluated / sessions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Timeline ── */}
            <div>
                {sessions.map((session, i) => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        index={i}
                        isLast={i === sessions.length - 1}
                        role={role}
                        onRefresh={load}
                    />
                ))}
            </div>
        </div>
    );
}