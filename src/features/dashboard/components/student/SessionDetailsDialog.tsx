import { SessionItem } from "../../server/studentDashboard.action";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, User, Stethoscope, FileText, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { getUserDetailsFromCookies } from "@/utils/sharedHelper";

interface Props {
  session: SessionItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
}

export default function SessionDetailsDialog({ session, isOpen, onOpenChange, language }: Props) {
  if (!session) return null;
  const isAr = language === "ar";
  const { userRole } = getUserDetailsFromCookies();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0" dir={isAr ? "rtl" : "ltr"}>
        <div className="bg-indigo-600 p-6 text-white">
          <DialogTitle className="text-xl font-bold">
            {isAr ? "تفاصيل الجلسة الكاملة" : "Full Session Details"}
          </DialogTitle>
          <p className="text-indigo-100 text-sm mt-1 opacity-90">
             #{session.id.slice(0, 8)}
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Patient & Treatment */}
          <div className="flex gap-4 items-start">
             <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-xl text-indigo-600">
                <User size={20} />
             </div>
             <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{isAr ? "المريض" : "Patient"}</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">{session.patientName}</p>
             </div>
          </div>

          <div className="flex gap-4 items-start">
             <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-xl text-emerald-600">
                <Stethoscope size={20} />
             </div>
             <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{isAr ? "نوع العلاج" : "Treatment"}</p>
                <p className="text-base font-medium text-slate-800 dark:text-slate-200">{session.treatmentType}</p>
             </div>
          </div>

          {/* Time */}
          <div className="flex gap-4 items-start">
             <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded-xl text-amber-600">
                <Clock size={20} />
             </div>
             <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{isAr ? "الوقت" : "Time"}</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                   {format(new Date(session.scheduledAt), "PPPP p", { locale: isAr ? ar : enUS })}
                </p>
             </div>
          </div>

          {/* Notes Section - If available */}
          {session.notes && session.notes.length > 0 && (
             <div className="space-y-3 pt-2">
                <p className="text-sm font-bold flex items-center gap-2">
                   <FileText size={16} /> {isAr ? "الملاحظات" : "Notes"}
                </p>
                <div className="space-y-2">
                   {session.notes.map((n) => (
                      <div key={n.id} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                         <p className="text-xs text-slate-600 dark:text-slate-400">{n.note}</p>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}