"use client";

import { SessionItem } from "../../server/studentDashboard.action";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Clock,
  User,
  Stethoscope,
  FileText,
  ChevronRight,
  Star,
  X,
  Hash,
} from "lucide-react";
import { format, isPast } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { getUserDetailsFromCookies } from "@/utils/sharedHelper";
import Link from "next/link";
import MyCustomButton from "@/components/ui/MyCustomButton";
import SessionInfoTile from "./SessionInfoTile";

interface Props {
  session: SessionItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
}

const statusConfig = {
  expired:   { label: { ar: "منتهية",   en: "Expired"   }, className: "bg-red-100   text-red-600   dark:bg-red-900/30   dark:text-red-400"   },
  completed: { label: { ar: "مكتملة",   en: "Completed" }, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  scheduled: { label: { ar: "مجدولة",   en: "Scheduled" }, className: "bg-blue-100  text-blue-600  dark:bg-blue-900/30  dark:text-blue-400"  },
  default:   { label: { ar: "غير معروف", en: "Unknown"  }, className: "bg-slate-100 text-slate-600 dark:bg-slate-800   dark:text-slate-400" },
};

function getStatusMeta(status: string | undefined, isExpired: boolean, isAr: boolean) {
  if (isExpired)                                 return statusConfig.expired;
  if (status?.toLowerCase() === "completed")     return statusConfig.completed;
  if (status?.toLowerCase() === "scheduled")     return statusConfig.scheduled;
  return statusConfig.default;
}

export default function SessionDetailsDialog({ session, isOpen, onOpenChange, language }: Props) {
  if (!session) return null;

  const isAr = language === "ar";
  const { userRole } = getUserDetailsFromCookies();

  const isScheduled = session.status?.toLowerCase() === "scheduled";
  const isExpired   = isScheduled && isPast(new Date(session.scheduledAt));
  const statusMeta  = getStatusMeta(session.status, isExpired, isAr);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        dir={isAr ? "rtl" : "ltr"}
        className="max-w-md gap-0 overflow-hidden rounded-2xl border border-slate-200 p-0 shadow-xl dark:border-slate-800 dark:bg-slate-900"
      >
        {/* ── Header ── */}
        <DialogHeader className="relative flex flex-row items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {isAr ? "تفاصيل الجلسة" : "Session Details"}
            </DialogTitle>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <Hash size={11} />
              <span className="font-mono">{session.id.slice(0, 8)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusMeta.className}`}
            >
              {isAr ? statusMeta.label.ar : statusMeta.label.en}
            </span>
            <DialogClose asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <div className="max-h-[60vh] overflow-y-auto bg-white px-6 py-6 dark:bg-slate-900">
          <div className="flex flex-col gap-5">

            {/* Info tiles */}
            <div className="flex flex-col gap-5 rounded-xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/30">
              <SessionInfoTile
                icon={<User />}
                label={isAr ? "المريض" : "Patient"}
                value={session.patientName}
                color="indigo"
              />
              <div className="h-px bg-slate-100 dark:bg-slate-800" />
              <SessionInfoTile
                icon={<Clock />}
                label={isAr ? "الموعد" : "Schedule"}
                value={format(new Date(session.scheduledAt), "PPPP · p", { locale: isAr ? ar : enUS })}
                color="amber"
                isWarning={isExpired}
              />
              <div className="h-px bg-slate-100 dark:bg-slate-800" />
              <SessionInfoTile
                icon={<Clock />}
                label={isAr ? "اخر تحديث:" : "Last Updated:"}
                value={format(new Date(session?.updateAt ? session?.updateAt : session?.endAt ), "PPPP · p", { locale: isAr ? ar : enUS })}
                color="amber"
                isWarning={isExpired}
              />
            </div>

            {/* Evaluation box */}
            {session.grade != null && (
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-5 dark:border-amber-900/30 dark:bg-amber-950/20">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <Star size={13} fill="currentColor" />
                    {isAr ? "التقييم الأكاديمي" : "Academic Evaluation"}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-amber-700 dark:text-amber-400">
                      {session.grade}
                    </span>
                    <span className="text-xs text-amber-500/70 dark:text-amber-600">/20</span>
                  </div>
                </div>

                {session.doctorNote && (
                  <p className="mb-3 rounded-lg border border-amber-100 bg-white/70 px-4 py-3 text-[13px] italic leading-relaxed text-amber-900/80 dark:border-amber-900/20 dark:bg-black/20 dark:text-amber-300">
                    "{session.doctorNote}"
                  </p>
                )}

                {session.evaluteDoctorName && (
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                      {session.evaluteDoctorName[0]}
                    </div>
                    <p className="text-[11px] font-medium text-amber-700/70 dark:text-amber-400/70">
                      {isAr ? "بواسطة د. " : "By Dr. "}
                      {session.evaluteDoctorName}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Progress notes */}
            {session.notes && session.notes.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <FileText size={13} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">
                    {isAr ? "ملاحظات التنفيذ" : "Progress Notes"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {session.notes.map((n) => (
                    <p
                      key={n.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400"
                    >
                      {n.note}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60 sm:flex-row mb-2">
          <Link href={`/cases/${session.caseId}`} className="flex-1">
            <MyCustomButton
              variant="outline"
              className="w-full rounded-xl py-2.5 text-xs font-semibold"
              rightIcon={
                <ChevronRight
                  size={14}
                  className={`opacity-40 ${isAr ? "rotate-180" : ""}`}
                />
              }
            >
              {isAr ? "عرض تفاصيل الحالة" : "View Case Details"}
            </MyCustomButton>
          </Link>

          {userRole === "Student" && !session.grade && (
            <MyCustomButton
              variant="solid"
              className="flex-1 rounded-xl py-2.5 text-xs font-semibold"
            >
              {isAr ? "تحديث الملاحظات" : "Update Notes"}
            </MyCustomButton>
          )}

          {userRole === "Doctor" && !session.grade && (
            <MyCustomButton
              variant="solid"
              className="flex-1 rounded-xl bg-amber-600 py-2.5 text-xs font-semibold hover:bg-amber-700"
            >
              {isAr ? "تقييم الآن" : "Evaluate Now"}
            </MyCustomButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}