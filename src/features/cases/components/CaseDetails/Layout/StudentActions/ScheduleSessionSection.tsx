"use client";

import { motion } from "framer-motion";
import { CalendarPlus, Play } from "lucide-react";
import ActionModal from "@/components/ui/ActionModal";
import SessionBookingDialog from "./Booking";
import { SessionBookingData, SessionItem } from "../../../../types/Sessions.types";

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
}: Props) {
    const hasScheduledSession = !!scheduledSession;

    return (
        <>
            {hasScheduledSession ? (
                <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    disabled={startNowLoading}
                    onClick={() => onToggleStartNowModal?.(true)}
                    className="my-btn w-full py-3 group"
                >
                    <Play size={15} className="group-hover:scale-110 transition-transform" />
                    {locale === "ar" ? "ابدأ الآن" : "Start Now"}
                </motion.button>
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
                open={showForm}
                onOpenChange={onToggleForm}
                onSubmit={onSubmit}
                isLoading={sessionLoading}
                locale={locale}
            />

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
        </>
    );
}