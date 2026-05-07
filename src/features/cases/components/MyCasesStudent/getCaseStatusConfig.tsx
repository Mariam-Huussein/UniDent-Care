import { Activity, AlertCircle, CheckCircle, Stethoscope } from "lucide-react";
import { Dictionary } from "@/utils/i18n/dictionaries";

export function getCaseStatusConfig(status: string, t?: Dictionary) {
  const s = status?.toLowerCase();
  if (s === "in-progress" || s === "inprogress")
    return { label: t?.statusInProgress ?? "In Progress", dot: "bg-amber-400", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", icon: Activity };
  if (s === "completed")
    return { label: t?.statusCompleted ?? "Completed", dot: "bg-emerald-400", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle };
  if (s === "diagnosis")
    return { label: t?.statusDiagnosis ?? "Diagnosis", dot: "bg-blue-400", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", icon: Stethoscope };
  return { label: t?.statusUnassigned ?? "Unassigned", dot: "bg-slate-400", text: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/60", icon: AlertCircle };
}
