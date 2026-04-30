"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { useStudentDashboardData } from "@/features/dashboard/hooks/useStudentDashboardData";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import MyCustomButton from "@/components/ui/MyCustomButton";
import { Calendar as CalendarIcon, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), { ssr: false });

export default function CalendarWidget() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const { sessions } = useStudentDashboardData();
  const { data, isLoading, isError } = sessions;

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

  const renderEventContent = (eventInfo: any) => {
    return (
      <div className="flex flex-col p-1 text-xs overflow-hidden h-full">
        <span className="font-bold truncate text-indigo-900 dark:text-indigo-100">{eventInfo.event.title}</span>
        <span className="text-[10px] opacity-80 font-medium truncate text-indigo-800 dark:text-indigo-200">{eventInfo.timeText}</span>
      </div>
    );
  };

  if (isError) {
    return (
      <Card className="h-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardContent className="flex items-center justify-center h-full text-destructive p-8">
          {isRtl ? "حدث خطأ في تحميل التقويم" : "Failed to load calendar"}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full rounded-2xl flex flex-col overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
        <CardContent className="flex-1 p-4 md:p-8 relative min-h-[700px]">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col p-8 space-y-6">
              <div className="flex justify-between">
                <div className="h-10 w-40 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
                <div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-2xl" />
            </div>
          ) : (
            <div className="h-full w-full calendar-container">
              <FullCalendar
                key={currentView}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView={currentView}
                headerToolbar={{
                  left: isRtl ? "prev,next today" : "prev,next today",
                  center: "title",
                  right: isRtl ? "dayGridMonth,timeGridWeek,listWeek" : "dayGridMonth,timeGridWeek,listWeek",
                }}
                locale={language}
                direction={isRtl ? "rtl" : "ltr"}
                events={data?.map((event) => ({
                  id: event.id,
                  title: `${event.patientName} - ${event.treatmentType}`,
                  start: event.scheduledAt,
                  end: event.endAt,
                  extendedProps: { patientName: event.patientName, treatmentType: event.treatmentType },
                }))}
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
          )}
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl" dir={isRtl ? "rtl" : "ltr"}>
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">{isRtl ? "تفاصيل الجلسة" : "Session Details"}</DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isRtl ? "استعرض تفاصيل هذه الجلسة والمهام المتاحة." : "View the details of this session and available actions."}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-6 py-4">
            {selectedEvent && (
              <div className="grid gap-5 py-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{isRtl ? "اسم المريض" : "Patient Name"}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">{selectedEvent.extendedProps?.patientName}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{isRtl ? "نوع العلاج" : "Treatment Type"}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-base">{selectedEvent.extendedProps?.treatmentType}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{isRtl ? "الوقت" : "Time"}</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 text-base">
                    <Clock className="w-4 h-4" />
                    {format(new Date(selectedEvent.start), "PPP p", { locale: isRtl ? ar : enUS })} -{" "}
                    {format(new Date(selectedEvent.end), "p", { locale: isRtl ? ar : enUS })}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 px-6 pb-6 pt-2 justify-end bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 mt-2 p-4">
            <MyCustomButton
              variant="outline"
              leftIcon={<Clock className="w-4 h-4" />}
              onClick={() => setIsDialogOpen(false)}
            >
              {isRtl ? "إعادة جدولة" : "Reschedule"}
            </MyCustomButton>
            <MyCustomButton
              variant="solid"
              leftIcon={<CheckCircle className="w-4 h-4" />}
              onClick={() => setIsDialogOpen(false)}
            >
              {isRtl ? "تأكيد الجلسة" : "Confirm Session"}
            </MyCustomButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
