"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, LayoutGrid, List, Clock, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";
import { StudentRequestItem } from "../../types/caseCardProps.types";
import SelectItems from "@/components/common/SelectItems";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/pagination";
import { StudentRequestCard } from "./StudentRequestCard";
import { MyCasesSkeleton } from "./MyCasesSkeleton";
import { MyCasesEmptyState } from "./MyCasesEmptyState";
import { getRequestStatusConfig } from "./getRequestStatusConfig";

interface RequestsTabContentProps {
    requests: StudentRequestItem[];
    requestsLoading: boolean;
    requestStatus: string;
    setRequestStatus: (val: string) => void;
    requestsPage: number;
    setRequestsPage: (val: number) => void;
    requestsTotalPages: number;
    requestsViewMode: "grid" | "table";
    setRequestsViewMode: (val: "grid" | "table") => void;
}

export function RequestsTabContent({
    requests, requestsLoading, requestStatus, setRequestStatus, requestsPage, setRequestsPage, requestsTotalPages,
    requestsViewMode, setRequestsViewMode
}: RequestsTabContentProps) {

  const REQUEST_STATUSES = ["Pending", "UnderReview", "Approved", "Rejected", "Taken", "Cancelled"];

  const requestColumns: Column<StudentRequestItem>[] = [
    {
      header: "Request Info",
      accessor: "patientName",
      render: (val, row) => (
        <div className="flex flex-col gap-0.5 max-w-[250px]">
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{val}</span>
            <span className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 truncate">{row.caseName || "—"}</span>
        </div>
      )
    },
    { 
      header: "Doctor", 
      accessor: "doctorName",
      render: (val) => val ? (
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 w-fit px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-700/50">
              <Stethoscope size={12} className="text-slate-400" />
              <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Dr. {val}</span>
          </div>
      ) : "—"
    },
    { 
      header: "Submission", 
      accessor: "createAt",
      render: (val) => (
        <span className="flex items-center gap-1.5 font-medium text-sm text-slate-500 dark:text-slate-400">
            <Clock size={13} className="text-amber-500" />
            {new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      )
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (val) => {
        const sc = getRequestStatusConfig(val);
        return (
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {sc.label}
          </span>
        )
      }
    },
    { 
      header: "", 
      accessor: "patientCasePublicId",
      render: (val) => (
        <Link href={`/my-cases/${val}`} className="group flex items-center justify-end gap-1 text-[12px] font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 transition-colors">
          Review Case <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      )
    }
  ];

  return (
    <motion.div
      key="requests"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Content Area */}
      {requestsLoading ? (
         requestsViewMode === 'grid' ? (
             <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 place-items-center">
                 {Array.from({ length: 6 }).map((_, i) => <MyCasesSkeleton key={i} />)}
             </div>
         ) : (
             <div className="space-y-4 pt-4"><div className="w-full h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" /><div className="w-full h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" /></div>
         )
      ) : requests.length === 0 ? (
         <MyCasesEmptyState message="No requests match your filter." />
      ) : (
          requestsViewMode === 'grid' ? (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
                  <AnimatePresence>
                      {requests.map((item, i) => (
                          <StudentRequestCard key={item.id} item={item} index={i} />
                      ))}
                  </AnimatePresence>
              </motion.div>
          ) : (
               <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}>
                  <DataTable columns={requestColumns} data={requests} />
              </motion.div>
          )
      )}

      <Pagination 
          currentPage={requestsPage} 
          totalPages={requestsTotalPages} 
          hasPreviousPage={requestsPage > 1}
          hasNextPage={requestsPage < requestsTotalPages}
          onPageChange={setRequestsPage} 
      />
    </motion.div>
  );
}
