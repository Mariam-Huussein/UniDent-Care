"use client";


import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { Translations } from "@/features/cases/types/Booking.types";
import { calcDuration } from "@/features/cases/utils/caseDetailsBooking.utils";

interface StepTimeProps {
    startTime: string;
    endTime: string;
    onStartChange: (v: string) => void;
    onEndChange: (v: string) => void;
    isLoading: boolean;
    t: Translations;
    isRTL: boolean;
}

export function StepTime({
    startTime,
    endTime,
    onStartChange,
    onEndChange,
    isLoading,
    t,
    isRTL,
}: StepTimeProps) {
    const timeValid = endTime > startTime;
    const durationStr = calcDuration(startTime, endTime);
    const showError = startTime && endTime && !timeValid;

    const fields = [
        { label: t.startTime, id: "booking-start-time", value: startTime, onChange: onStartChange },
        { label: t.endTime, id: "booking-end-time", value: endTime, onChange: onEndChange },
    ] as const;

    return (
        <div>
            <div className={`grid grid-cols-2 gap-3 mb-4 ${isRTL ? "direction-rtl" : ""}`}>
                {fields.map(({ label, id, value, onChange }) => (
                    <div key={id}>
                        <label
                            htmlFor={id}
                            className="block text-[11px] text-muted-foreground mb-1.5"
                        >
                            {label}
                        </label>
                        <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2.5 focus-within:border-primary transition-colors">
                            <Clock size={13} className="text-muted-foreground shrink-0" aria-hidden />
                            <input
                                id={id}
                                type="time"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                disabled={isLoading}
                                className="bg-transparent border-none outline-none text-[13px] text-foreground w-full"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Duration / error chip */}
            <AnimatePresence mode="wait">
                {timeValid && durationStr ? (
                    <motion.div
                        key="duration-ok"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 bg-primary/10 text-primary rounded-lg px-3 py-2.5"
                    >
                        <Clock size={13} aria-hidden />
                        <span className="text-[12px] font-medium">
                            {t.duration}: {durationStr}
                        </span>
                    </motion.div>
                ) : showError ? (
                    <motion.div
                        key="duration-err"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-lg px-3 py-2.5"
                        role="alert"
                    >
                        <span className="text-[12px]">{t.errorTime}</span>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}