import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { customeFormatDate, customeFormatTime } from "../../../services/sessionHelper";

export default function SessionHeader ({ name, date, status, isDone }: { name: string; date: string; status: string; isDone: boolean }) {
    return (
    <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
            <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100">{name}</span>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={10} />{customeFormatDate(date)}</span>
                <span className="text-slate-200 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1"><Clock size={10} />{customeFormatTime(date)}</span>
            </div>
        </div>
        <span className={`shrink-0 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isDone ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
        }`}>
            <CheckCircle2 size={9} /> {status}
        </span>
    </div>
    )
};