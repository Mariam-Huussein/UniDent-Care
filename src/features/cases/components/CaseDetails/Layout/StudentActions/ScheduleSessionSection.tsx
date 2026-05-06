"use client";

import { motion } from "framer-motion";
import { CalendarPlus, Play, CalendarClock, Trash2, RefreshCw } from "lucide-react";
import ActionModal from "@/components/ui/ActionModal";
import SessionBookingDialog from "./Booking";
import { SessionBookingData, SessionItem, SessionStatus } from "../../../../../session/types/Sessions.types";

interface Props {
    showForm: boolean;
    onToggleForm: (show: boolean) => void;
    onSubmit: (data: SessionBookingData) => Promise<void>;
    sessionLoading: boolean;
    locale?: "en" | "ar";
    scheduledSession?: SessionItem | null;
    showStartNowModal?: boolean;
    onToggleStartNowModal?: (show: boolean) => void;
    onStartNow?: () => void;
    startNowLoading?: boolean;
    // Cancel session props
    showCancelSessionModal?: boolean;
    onToggleCancelSessionModal?: (show: boolean) => void;
    onCancelSession?: () => void;
    cancelSessionLoading?: boolean;
}

export default function ScheduleSessionSection({
    showForm,
    onToggleForm,
    onSubmit,
    sessionLoading,
    locale = "en",
    scheduledSession,
    showStartNowModal = false,
    onToggleStartNowModal,
    onStartNow,
    startNowLoading = false,
    showCancelSessionModal = false,
    onToggleCancelSessionModal,
    onCancelSession,
    cancelSessionLoading = false,
}: Props) {
    const hasScheduledSession = !!scheduledSession;
    const status: SessionStatus = scheduledSession?.status as SessionStatus;
    const isExpired = status === 3 || (() => {
        if (!scheduledSession) return false;
        const sd = new Date(scheduledSession.scheduledAt);
        sd.setHours(0, 0, 0, 0);
        const td = new Date();
        td.setHours(0, 0, 0, 0);
        return sd.getTime() < td.getTime();
    })();

    const formatSessionTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            {hasScheduledSession && !isExpired ? (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl border border-blue-200/60 dark:border-blue-800/50 bg-blue-50/70 dark:bg-blue-900/10 p-4 space-y-3"
                >
                    {/* Session badge */}
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                        <CalendarClock size={13} />
                        {locale === "ar" ? "جلسة محجوزة" : "Upcoming Session"}
                    </p>

                    {/* Session time */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                            <CalendarClock size={14} className="text-blue-500 shrink-0" />
                            <span className="font-medium">{formatSessionTime(scheduledSession.scheduledAt)}</span>
                        </div>
                        {scheduledSession.endAt && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 ml-5.5 pl-0.5">
                                {locale === "ar" ? "حتى" : "Ends"}{" "}
                                {new Date(scheduledSession.endAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                            disabled={cancelSessionLoading}
                            onClick={() => onToggleCancelSessionModal?.(true)}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 text-xs font-semibold py-2.5 px-3 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <Trash2 size={13} />
                            {locale === "ar" ? "إلغاء الجلسة" : "Cancel Session"}
                        </button>

                        <button
                            disabled={sessionLoading}
                            onClick={() => onToggleForm(true)}
                            className="my-btn flex items-center justify-center gap-1.5 py-2.5 text-xs group cursor-pointer"
                        >
                            <RefreshCw size={13} className="group-hover:rotate-180 transition-transform duration-500" />
                            {locale === "ar" ? "تغيير الموعد" : "Reschedule"}
                        </button>
                    </div>
                </motion.div>
            ) : hasScheduledSession && isExpired ? (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl border border-rose-200/60 dark:border-rose-800/50 bg-rose-50/70 dark:bg-rose-900/10 p-4 space-y-3"
                >
                    {/* Session badge */}
                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                        <CalendarClock size={13} />
                        {locale === "ar" ? "جلسة منتهية الصلاحية" : "Session Expired"}
                    </p>

                    {/* Session time */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                            <CalendarClock size={14} className="text-rose-500 shrink-0" />
                            <span className="font-medium line-through opacity-70">{formatSessionTime(scheduledSession.scheduledAt)}</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                            disabled={sessionLoading}
                            onClick={() => onToggleForm(true)}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs font-semibold py-2.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <CalendarPlus size={13} />
                            {locale === "ar" ? "جدولة جديدة" : "Reschedule"}
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    disabled={sessionLoading}
                    onClick={() => onToggleForm(true)}
                    className="my-btn w-full py-3 group"
                >
                    <CalendarPlus size={15} className="group-hover:scale-110 transition-transform" />
                    {locale === "ar" ? "حجز جلسة جديدة" : "Schedule New Session"}
                </motion.button>
            )}

            <SessionBookingDialog
                hasScheduledSession={!!hasScheduledSession}
                open={showForm}
                onOpenChange={onToggleForm}
                onSubmit={onSubmit}
                onStartNow={onStartNow}
                onToggleStartNowModal={onToggleStartNowModal}
                isLoading={sessionLoading}
                locale={locale}
            />

            {/* Start Now confirmation */}
            <ActionModal
                isOpen={showStartNowModal}
                onClose={() => onToggleStartNowModal?.(false)}
                onAction={() => onStartNow?.()}
                title={locale === "ar" ? "بدء الجلسة" : "Start Session"}
                message={
                    locale === "ar"
                        ? "هل أنت متأكد أنك تريد بدء هذه الجلسة الآن؟ سيتم تغيير حالة الجلسة إلى 'قيد التنفيذ'."
                        : "Are you sure you want to start this session now? The session status will be changed to 'In Progress'."
                }
                actionText={locale === "ar" ? "ابدأ الآن" : "Start Now"}
                cancelText={locale === "ar" ? "إلغاء" : "Cancel"}
                isLoading={startNowLoading}
                variant="primary"
            />

            {/* Cancel session confirmation */}
            <ActionModal
                isOpen={showCancelSessionModal}
                onClose={() => onToggleCancelSessionModal?.(false)}
                onAction={() => onCancelSession?.()}
                title={locale === "ar" ? "إلغاء الجلسة" : "Cancel Session"}
                message={
                    locale === "ar"
                        ? "هل أنت متأكد أنك تريد إلغاء هذه الجلسة؟ لا يمكن التراجع عن هذا الإجراء."
                        : "Are you sure you want to cancel this session? This action cannot be undone."
                }
                actionText={locale === "ar" ? "نعم، إلغاء الجلسة" : "Yes, Cancel Session"}
                cancelText={locale === "ar" ? "تراجع" : "Go Back"}
                isLoading={cancelSessionLoading}
                variant="danger"
            />
        </>
    );
}