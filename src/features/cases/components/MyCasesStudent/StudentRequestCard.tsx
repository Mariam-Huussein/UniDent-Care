// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";
// import { Clock, ArrowRight, Stethoscope } from "lucide-react";
// import { StudentRequestItem } from "../../types/caseCardProps.types";
// import { getRequestStatusConfig } from "./getRequestStatusConfig";

// export function StudentRequestCard({ item, index }: { item: StudentRequestItem; index: number }) {
//   const sc = getRequestStatusConfig(item.status);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay: index * 0.05 }}
//       className="flex justify-center h-full w-full"
//     >
//       <div className="w-11/12 flex flex-col rounded-2xl bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/80 p-5 space-y-4 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300">
//         <div className="flex items-start justify-between gap-2">
//           <div className="min-w-0">
//             <p className="text-[15px] font-bold text-slate-800 dark:text-slate-100 truncate">{item.patientName}</p>
//             <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5 truncate font-medium">{item.caseName}</p>
//           </div>
//           <span className={`shrink-0 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
//             <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
//             {sc.label}
//           </span>
//         </div>

//         {item.doctorName && (
//           <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 w-fit px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
//             <Stethoscope size={13} className="text-indigo-400" />
//             <span>Assigned to <span className="font-semibold text-slate-700 dark:text-slate-300">Dr. {item.doctorName}</span></span>
//           </div>
//         )}

//         {item.description && (
//           <p className="flex-1 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 border-l-2 border-indigo-200 dark:border-indigo-500/30 pl-3 italic">
//             "{item.description}"
//           </p>
//         )}

//         <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
//           <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
//             <Clock size={12} />
//             {new Date(item.createAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
//           </div>
//           <Link
//             href={`/my-cases/${item.patientCasePublicId}`}
//             className="group flex items-center gap-1 text-[11px] font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 transition-colors bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg"
//           >
//             View Details <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
//           </Link>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, Stethoscope, GraduationCap, User } from "lucide-react";
import { StudentRequestItem } from "../../types/caseCardProps.types";
import { getRequestStatusConfig } from "./getRequestStatusConfig";

export function StudentRequestCard({ item, index }: { item: StudentRequestItem; index: number }) {
  const sc = getRequestStatusConfig(item.status);

  const formattedDate = new Date(item.createAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const initials = item.patientName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="h-full w-full"
    >
      <div className="group relative h-full flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/8 hover:-translate-y-0.5 hover:border-slate-200 dark:hover:border-slate-700">
        
        {/* Status accent bar */}
        <div className={`h-0.5 w-full ${sc.bar ?? "bg-slate-200 dark:bg-slate-700"}`} />

        <div className="flex flex-col flex-1 p-5 gap-4">

          {/* Header: avatar + name + status */}
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="text-[13px] font-bold text-indigo-600 dark:text-indigo-300 tracking-wide">
                {initials}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-50 truncate leading-tight">
                    {item.patientName}
                  </p>
                  <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5 truncate font-medium">
                    {item.caseName}
                  </p>
                </div>
                <span
                  className={`shrink-0 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${sc.bg} ${sc.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {sc.label}
                </span>
              </div>
            </div>
          </div>

          {/* Meta row: student + doctor */}
          <div className="flex flex-wrap gap-2">
            {item.studentName && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                <GraduationCap size={12} className="text-slate-400 dark:text-slate-500" />
                <span className="truncate max-w-[120px]">{item.studentName}</span>
                {item.level && (
                  <span className="text-slate-400 dark:text-slate-600">· Y{item.level}</span>
                )}
              </div>
            )}
            {item.doctorName && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                <Stethoscope size={12} className="text-indigo-400 dark:text-indigo-500" />
                <span className="truncate max-w-[120px]">
                  Dr. <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.doctorName}</span>
                </span>
              </div>
            )}
            {item.university && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                <User size={12} className="text-slate-400 dark:text-slate-500" />
                <span className="truncate max-w-[100px]">{item.university}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div className="flex-1 relative pl-3">
              <div className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-indigo-200 dark:bg-indigo-700/50" />
              <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 italic">
                {item.description}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-600">
              <Clock size={11} />
              <span>{formattedDate}</span>
            </div>

            <Link
              href={`/my-cases/${item.patientCasePublicId}`}
              className="group/btn flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-all duration-200"
            >
              View Details
              <ArrowRight
                size={11}
                className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}