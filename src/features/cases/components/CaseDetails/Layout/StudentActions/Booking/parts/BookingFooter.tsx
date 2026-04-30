"use client";

import { Loader2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Translations } from "@/features/cases/types/Booking.types";

interface BookingFooterProps {
    step: number;
    isLoading: boolean;
    isUpdateMode: boolean;
    canGoNext: boolean;
    locationFilled: boolean;
    onBack: () => void;
    onNext: () => void;
    onConfirm: () => void;
    t: Translations;
    isRTL: boolean;
}

export function BookingFooter({
    step,
    isLoading,
    isUpdateMode,
    canGoNext,
    locationFilled,
    onBack,
    onNext,
    onConfirm,
    t,
    isRTL,
}: BookingFooterProps) {
    const BackIcon = isRTL ? ChevronRight : ChevronLeft;
    const ForwardIcon = isRTL ? ChevronLeft : ChevronRight;

    const confirmLabel = isLoading
        ? (isUpdateMode ? t.saving : t.booking)
        : (isUpdateMode ? t.saveChanges : t.confirm);

    const confirmDisabled = isLoading || !locationFilled;
    const nextDisabled = !canGoNext || isLoading;

    return (
        <div
            className={[
                "border-t border-border px-5 py-4",
                "flex items-center gap-2",
                isRTL ? "flex-row-reverse" : "",
            ].join(" ")}
        >
            {/* Cancel / Back */}
            <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="my-btn-outline flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-50"
            >
                {step > 1 && <BackIcon size={14} aria-hidden />}
                {step === 1 ? t.cancel : t.back}
            </button>

            <div className="flex-1" />

            {/* Next / Confirm */}
            {step < 3 ? (
                <button
                    type="button"
                    onClick={onNext}
                    disabled={nextDisabled}
                    className={[
                        "my-btn flex items-center gap-1.5 px-4 py-2 text-sm",
                        nextDisabled ? "opacity-40 cursor-not-allowed" : "",
                    ].join(" ")}
                >
                    {t.next}
                    <ForwardIcon size={14} aria-hidden />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={confirmDisabled}
                    className={[
                        "my-btn flex items-center gap-2 px-4 py-2 text-sm",
                        confirmDisabled ? "opacity-40 cursor-not-allowed" : "",
                    ].join(" ")}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={13} className="animate-spin" aria-hidden />
                            {confirmLabel}
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={13} aria-hidden />
                            {confirmLabel}
                        </>
                    )}
                </button>
            )}
        </div>
    );
}