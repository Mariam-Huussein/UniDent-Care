import { motion } from "framer-motion";
import { ToothBadge } from "./ToothSelector";
import { getStageName } from "../screens/AddScreen";
import { DiagnosisHistoryItem } from "../types/AddCase.types";

export default function HistoryCard({ item, index }: { item: DiagnosisHistoryItem; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="relative bg-white/70 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 space-y-2.5 hover:border-indigo-200 transition-all">
      <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-linear-to-b from-indigo-400 to-violet-500" />
      <div className="pl-3 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.caseTypeName || "Unknown"}</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/40 uppercase tracking-wider">
          {getStageName(item.stage)}
        </span>
        {item.createAt && <span className="text-[10px] text-slate-400 ml-auto">{new Date(item.createAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
      </div>
      {item.notes && <p className="pl-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.notes}</p>}
      {item.teethNumbers?.length > 0 && (
        <div className="pl-3 flex flex-wrap gap-1.5">{item.teethNumbers.map((t) => <ToothBadge key={t} num={t} />)}</div>
      )}
    </motion.div>
  );
}