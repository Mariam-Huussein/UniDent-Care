"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, User, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { SessionDto } from "@/services/PatientDashboardAnalytics";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), { ssr: false });

interface PatientCalendarWidgetProps {
  sessions: SessionDto[];
}

export default function PatientCalendarWidget({ sessions }: PatientCalendarWidgetProps) {
  const { language, t } = useLanguage();
  const isRtl = language === "ar";

  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dayGridMonth");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentView("listWeek");
      } else {
        setCurrentView("dayGridMonth");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      extendedProps: clickInfo.event.extendedProps,
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "completed") return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    if (s === "scheduled") return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    if (s === "cancelled") return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
    return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
  };

  const renderEventContent = (eventInfo: any) => {
    return (
      <div className="flex flex-col p-1 text-xs overflow-hidden h-full">
        <span className="font-bold truncate text-indigo-900 dark:text-indigo-100">{eventInfo.event.title}</span>
        <span className="text-[10px] opacity-80 font-medium truncate text-indigo-800 dark:text-indigo-200">{eventInfo.timeText}</span>
      </div>
    );
  };

  const calendarEvents = sessions.map((s) => ({
    id: s.id,
    title: s.studentName
      ? `${s.studentName}${s.treatmentType ? ` - ${s.treatmentType}` : ""}`
      : s.treatmentType || t.dashCalendarSessionFallback,
    start: s.scheduledAt,
    end: s.endAt || undefined,
    extendedProps: {
      studentName: s.studentName,
      treatmentType: s.treatmentType,
      status: s.status,
      caseId: s.caseId,
    },
  }));

  return (
    <>
      <Card className="h-full rounded-2xl flex flex-col overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
        <CardContent className="flex-1 p-4 md:p-8 relative min-h-[700px]">
          <div className="h-full w-full calendar-container">
            <FullCalendar
              key={currentView}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView={currentView}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,listWeek",
              }}
              locale={language}
              direction={isRtl ? "rtl" : "ltr"}
              events={calendarEvents}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              height="auto"
              aspectRatio={1.5}
              handleWindowResize={true}
              allDaySlot={false}
              slotMinTime="08:00:00"
              slotMaxTime="22:00:00"
              expandRows={true}
              dayMaxEvents={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Session Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl" dir={isRtl ? "rtl" : "ltr"}>
          <div className="bg-blue-50/50 dark:bg-blue-950/20 px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {t.dashCalendarSessionDetails}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.dashCalendarSessionDetailsDesc}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-4">
            {selectedEvent && (
              <div className="grid gap-5 py-2">
                {/* Student / Doctor */}
                {selectedEvent.extendedProps?.studentName && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                        {t.dashCalendarDoctorStudent}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                        {selectedEvent.extendedProps.studentName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Treatment Type */}
                {selectedEvent.extendedProps?.treatmentType && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                        {t.dashCalendarTreatmentType}
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-base">
                        {selectedEvent.extendedProps.treatmentType}
                      </span>
                    </div>
                  </div>
                )}

                {/* Time */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                      {t.dashCalendarTime}
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 text-base">
                      {format(new Date(selectedEvent.start), "PPP p", { locale: isRtl ? ar : enUS })}
                      {selectedEvent.end && (
                        <> - {format(new Date(selectedEvent.end), "p", { locale: isRtl ? ar : enUS })}</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Status */}
                {selectedEvent.extendedProps?.status && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                        {t.dashCalendarStatus}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border w-fit ${getStatusColor(selectedEvent.extendedProps.status)}`}>
                        {selectedEvent.extendedProps.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
