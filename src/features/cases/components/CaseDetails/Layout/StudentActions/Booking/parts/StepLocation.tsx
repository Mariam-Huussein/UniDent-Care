"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ar as arLocale, enUS } from "date-fns/locale";
import { Translations, Locale } from "@/features/cases/types/Booking.types";
import { calcDuration, formatTime } from "@/features/cases/utils/caseDetailsBooking.utils";

interface StepLocationProps {
    location: string;
    onLocationChange: (v: string) => void;
    selectedDate: Date | undefined;
    startTime: string;
    endTime: string;
    error: string;
    isLoading: boolean;
    t: Translations;
    locale: Locale;
    isRTL: boolean;
}

export function StepLocation({
    location,
    onLocationChange,
    selectedDate,
    startTime,
    endTime,
    error,
    isLoading,
    t,
    locale,
    isRTL,
}: StepLocationProps) {
    const dateLocale = locale === "ar" ? arLocale : enUS;
    const durationStr = calcDuration(startTime, endTime);

    const summaryRows = [
        {
            icon: <CalendarDays size={13} className="text-primary mt-0.5 shrink-0" aria-hidden />,
            label: t.dateLabel,
            value: selectedDate
                ? format(selectedDate, "EEEE, MMMM d, yyyy", { locale: dateLocale })
                : "—",
        },
        {
            icon: <Clock size={13} className="text-primary mt-0.5 shrink-0" aria-hidden />,
            label: t.timeLabel,
            value: `${formatTime(startTime)} → ${formatTime(endTime)}${durationStr ? `  (${durationStr})` : ""}`,
        },
        {
            icon: <MapPin size={13} className="text-primary mt-0.5 shrink-0" aria-hidden />,
            label: t.locationLabel,
            value: location.trim() || "—",
        },
    ] as const;

    return (
        <div>
            {/* Location input */}
            <div className="mb-4">
                <label className="block text-[11px] text-muted-foreground mb-1.5">
                    {t.locationLabel}{" "}
                    <span className="text-destructive" aria-hidden>*</span>
                </label>
                <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2.5 focus-within:border-primary transition-colors">
                    <MapPin size={13} className="text-muted-foreground shrink-0" aria-hidden />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => onLocationChange(e.target.value)}
                        placeholder={t.locationPlaceholder}
                        disabled={isLoading}
                        aria-required="true"
                        className="bg-transparent border-none outline-none text-[13px] text-foreground placeholder:text-muted-foreground w-full"
                    />
                </div>
            </div>

            {/* Summary card */}
            <div
                className="bg-muted/40 border border-border rounded-lg overflow-hidden"
                aria-label={t.summary}
            >
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 pt-3 pb-1.5">
                    {t.summary}
                </p>

                {summaryRows.map(({ icon, label, value }, idx) => (
                    <div
                        key={label}
                        className={[
                            "flex items-start gap-2.5 px-3 py-2.5",
                            idx < summaryRows.length - 1 ? "border-b border-border" : "pb-3",
                        ].join(" ")}
                    >
                        {icon}
                        <div className={`min-w-0 flex-1 ${isRTL ? "text-right" : ""}`}>
                            <p className="text-[10px] text-muted-foreground mb-0.5 leading-none">
                                {label}
                            </p>
                            <p className="text-[12px] text-foreground font-medium leading-snug wrap-break-word">
                                {value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submission error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        key="submit-error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        role="alert"
                        className="mt-3 bg-destructive/10 text-destructive rounded-lg px-3 py-2"
                    >
                        <p className="text-[12px]">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}