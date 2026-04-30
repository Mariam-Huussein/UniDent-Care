"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { BookingFooter } from "./parts/BookingFooter";
import { BookingStepper } from "./parts/Bookingstepper";
import { StepDate } from "./parts/StepDate";
import { StepTime } from "./parts/StepTime";
import { StepLocation } from "./parts/StepLocation";
import { SessionBookingData } from "@/features/cases/types/Sessions.types";
import { normalizeTime } from "@/features/cases/utils/caseDetailsBooking.utils";
import { Locale, translations } from "@/features/cases/types/Booking.types";

// ─── Props ────────────────────────────────────────────────────

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: SessionBookingData) => Promise<void>;
    initialData?: SessionBookingData;
    isLoading?: boolean;
    locale?: Locale;
}

const slideVariants = {
    enter: (dir: number) => ({
        x: dir > 0 ? 52 : -52,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] as const },
    },
    exit: (dir: number) => ({
        x: dir > 0 ? -52 : 52,
        opacity: 0,
        transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] as const },
    }),
};

const DEFAULT_START = "08:00";
const DEFAULT_END = "09:00";

export default function SessionBookingDialog({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    isLoading = false,
    locale = "en",
}: Props) {
    // ── Derived flags ──────────────────────────────────────────
    const isUpdateMode = !!initialData;
    const t = translations[locale];
    const isRTL = locale === "ar";
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    // ── State ──────────────────────────────────────────────────
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        initialData?.date
    );
    const [startTime, setStartTime] = useState(
        initialData ? normalizeTime(initialData.startTime) : DEFAULT_START
    );
    const [endTime, setEndTime] = useState(
        initialData ? normalizeTime(initialData.endTime) : DEFAULT_END
    );
    const [location, setLocation] = useState(initialData?.location ?? "");
    const [error, setError] = useState("");

    // Re-sync whenever initialData changes
    useEffect(() => {
        if (initialData) {
            setSelectedDate(initialData.date);
            setStartTime(normalizeTime(initialData.startTime));
            setEndTime(normalizeTime(initialData.endTime));
            setLocation(initialData.location);
        }
    }, [initialData]);

    // ── Derived booleans ───────────────────────────────────────
    const timeValid = endTime > startTime;
    const canGoNext =
        (step === 1 && !!selectedDate) ||
        (step === 2 && !!startTime && !!endTime && timeValid);

    // ── Navigation ─────────────────────────────────────────────
    const goNext = () => {
        setError("");
        setDirection(1);
        setStep((s) => s + 1);
    };

    const goBack = () => {
        setError("");
        setDirection(-1);
        setStep((s) => Math.max(1, s - 1));
    };

    // ── Reset ──────────────────────────────────────────────────
    const resetForm = useCallback(() => {
        setStep(1);
        setDirection(1);
        setError("");
        if (initialData) {
            // Reset to original values in Update Mode
            setSelectedDate(initialData.date);
            setStartTime(normalizeTime(initialData.startTime));
            setEndTime(normalizeTime(initialData.endTime));
            setLocation(initialData.location);
        } else {
            setSelectedDate(undefined);
            setStartTime(DEFAULT_START);
            setEndTime(DEFAULT_END);
            setLocation("");
        }
    }, [initialData]);

    const handleClose = () => {
        resetForm();
        onOpenChange(false);
    };

    // ── Submit ─────────────────────────────────────────────────
    const handleConfirm = async () => {
        setError("");

        if (!selectedDate || !startTime || !endTime || !location.trim()) {
            setError(t.errorFields);
            return;
        }
        if (!timeValid) {
            setError(t.errorTime);
            return;
        }

        try {
            await onSubmit({
                date: selectedDate,
                startTime: startTime + ":00",
                endTime: endTime + ":00",
                location: location.trim(),
            });
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
    };

    // ── Dialog title ───────────────────────────────────────────
    const dialogTitle = isUpdateMode ? t.titleUpdate : t.titleCreate;

    // ──────────────────────────────────────────────────────────
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                dir={isRTL ? "rtl" : "ltr"}
                className="gap-0 p-0 overflow-hidden sm:max-w-[430px]"
            >
                {/* Accessible hidden title for screen readers */}
                <DialogHeader className="sr-only">
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {t.stepSubs[step - 1]}
                    </DialogDescription>
                </DialogHeader>
                {/* ── Header ─────────────────────────────────────── */}
                <div className="bg-primary/6 border-b border-border px-5 pt-5 pb-4">
                    <div className="mb-4">
                        <p className="text-[15px] font-semibold text-foreground leading-tight">
                            {dialogTitle}
                        </p>
                        <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                            {t.stepSubs[step - 1]}
                        </p>
                    </div>

                    <BookingStepper step={step} t={t} isRTL={isRTL} />
                </div>

                {/* ── Body ───────────────────────────────────────── */}
                <div className="relative overflow-hidden px-5 py-5 min-h-[340px]">
                    <AnimatePresence custom={direction} mode="wait">

                        {step === 1 && (
                            <motion.div
                                key="step-1"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <StepDate
                                    selectedDate={selectedDate}
                                    onSelect={setSelectedDate}
                                    today={today}
                                    locale={locale}
                                />
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step-2"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <StepTime
                                    startTime={startTime}
                                    endTime={endTime}
                                    onStartChange={setStartTime}
                                    onEndChange={setEndTime}
                                    isLoading={isLoading}
                                    t={t}
                                    isRTL={isRTL}
                                />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step-3"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <StepLocation
                                    location={location}
                                    onLocationChange={setLocation}
                                    selectedDate={selectedDate}
                                    startTime={startTime}
                                    endTime={endTime}
                                    error={error}
                                    isLoading={isLoading}
                                    t={t}
                                    locale={locale}
                                    isRTL={isRTL}
                                />
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* ── Footer ─────────────────────────────────────── */}
                <BookingFooter
                    step={step}
                    isLoading={isLoading}
                    isUpdateMode={isUpdateMode}
                    canGoNext={canGoNext}
                    locationFilled={!!location.trim()}
                    onBack={step === 1 ? handleClose : goBack}
                    onNext={goNext}
                    onConfirm={handleConfirm}
                    t={t}
                    isRTL={isRTL}
                />
            </DialogContent>
        </Dialog>
    );
}