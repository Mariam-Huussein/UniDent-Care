"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Translations } from "@/features/cases/types/Booking.types";

interface BookingStepperProps {
  step: number;          // current active step (1 | 2 | 3)
  t: Translations;
  isRTL: boolean;
}

export function BookingStepper({ step, t, isRTL }: BookingStepperProps) {
  return (
    <div
      className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
      role="list"
      aria-label="Progress"
    >
      {([1, 2, 3] as const).map((s) => {
        const isDone = s < step;
        const isActive = s === step;

        return (
          <React.Fragment key={s}>
            <div
              role="listitem"
              aria-current={isActive ? "step" : undefined}
              className={[
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                "text-[11px] font-medium transition-all duration-300 select-none",
                isActive ? "bg-primary text-primary-foreground" : "",
                isDone ? "bg-primary/15 text-primary" : "",
                !isActive && !isDone ? "bg-muted text-muted-foreground" : "",
              ].join(" ")}
            >
              {isDone ? (
                <CheckCircle2 size={11} aria-hidden />
              ) : (
                <span className="w-3.5 text-center" aria-hidden>
                  {s}
                </span>
              )}
              <span>{t.steps[s - 1]}</span>
            </div>

            {s < 3 && (
              <div className="h-px w-4 bg-border shrink-0" aria-hidden />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}