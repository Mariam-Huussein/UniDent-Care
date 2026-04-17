"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, Stethoscope } from "lucide-react";
import { StudentRequestItem } from "../../types/caseCardProps.types";
import { getRequestStatusConfig } from "./getRequestStatusConfig";

export function StudentRequestCard({ item, index }: { item: StudentRequestItem; index: number }) {
  const sc = getRequestStatusConfig(item.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex justify-center h-full w-full"
    >
      <div className="w-11/12 flex flex-col rounded-2xl bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/80 p-5 space-y-4 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-slate-800 dark:text-slate-100 truncate">{item.patientName}</p>
            <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5 truncate font-medium">{item.caseName || "—"}</p>
          </div>
          <span className={`shrink-0 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>
        </div>

        {item.doctorName && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 w-fit px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <Stethoscope size={13} className="text-indigo-400" />
            <span>Assigned to <span className="font-semibold text-slate-700 dark:text-slate-300">Dr. {item.doctorName}</span></span>
          </div>
        )}

        {item.description && (
          <p className="flex-1 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 border-l-2 border-indigo-200 dark:border-indigo-500/30 pl-3 italic">
            "{item.description}"
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            <Clock size={12} />
            {new Date(item.createAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
          <Link
            href={`/cases/${item.patientCasePublicId}`}
            className="group flex items-center gap-1 text-[11px] font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 transition-colors bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg"
          >
            View Details <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
