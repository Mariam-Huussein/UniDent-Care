"use client";

// Calendar date picker using the official shadcn

import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ar as arLocale, enUS } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Locale } from "@/features/cases/types/Booking.types";

interface StepDateProps {
    selectedDate: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    today: Date;
    locale: Locale;
}

export function StepDate({ selectedDate, onSelect, today, locale }: StepDateProps) {
    const dateLocale = locale === "ar" ? arLocale : enUS;

    return (
        <div>
            {/* shadcn Calendar — no manual grid, no manual month logic */}
            <div className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onSelect}
                    disabled={(date) => date < today}
                    locale={dateLocale}
                    className="rounded-lg border border-border"
                />
            </div>

            {/* Selected date confirmation badge */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        key="date-badge"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 flex items-center gap-2 text-primary"
                    >
                        <CalendarDays size={13} aria-hidden />
                        <span className="text-[12px] font-medium">
                            {format(selectedDate, "EEEE, MMMM d, yyyy", { locale: dateLocale })}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}