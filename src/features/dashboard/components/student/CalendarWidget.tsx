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
import SessionDetailsDialog from "./SessionDetailsDialog";
import { SessionItem } from "../../server/studentDashboard.action";

const FullCalendar = dynamic(() => import("@fullcalendar/react"), { ssr: false });

export default function CalendarWidget() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const { sessions } = useStudentDashboardData();
  const { data, isLoading, isError } = sessions;

  const [selectedEvent, setSelectedEvent] = useState<SessionItem | null>(null);
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
    const sessionData = clickInfo.event.extendedProps.rawSession as SessionItem;
    setSelectedEvent(sessionData);
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
                events={data?.map((event:SessionItem) => ({
                  id: event.id,
                  title: event.patientName,
                  start: event.scheduledAt,
                  end: event.endAt,
                  extendedProps: { rawSession: event },
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
      <SessionDetailsDialog
        session={selectedEvent}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        language={language}
      />
    </>
  );
}
