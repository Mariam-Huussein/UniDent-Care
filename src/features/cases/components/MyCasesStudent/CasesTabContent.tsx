"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, User, GraduationCap, Calendar } from "lucide-react";
import Link from "next/link";
import { StudentCaseItem, CaseItem } from "../../types/caseCardProps.types";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/pagination";
import CaseCard from "../CaseCard";
import { MyCasesSkeleton } from "./MyCasesSkeleton";
import { MyCasesEmptyState } from "./MyCasesEmptyState";
import { getCaseStatusConfig } from "./getCaseStatusConfig";

interface CasesTabContentProps {
    cases: StudentCaseItem[];
    casesLoading: boolean;
    caseType: string;
    setCaseType: (val: string) => void;
    casesPage: number;
    setCasesPage: (val: number) => void;
    casesTotalPages: number;
    casesViewMode: "grid" | "table";
    setCasesViewMode: (val: "grid" | "table") => void;
}

const mapStudentCaseToCaseItem = (item: StudentCaseItem): CaseItem => ({
    id: item.id,
    patientId: item.patientId,
    patientName: item.patientName,
    patientAge: item.patientAge,
    caseType: item.diagnosisdto ? { publicId: "", name: item.diagnosisdto.caseType, description: "" } : null,
    status: item.status,
    createAt: item.createAt,
    totalSessions: item.totalSessions,
    pendingRequests: item.pendingRequests,
    imageUrls: item.imageUrls,
    gender: undefined,
    diagnosisdto: item.diagnosisdto ? [item.diagnosisdto] : null,
});

export function CasesTabContent({
    cases, casesLoading, caseType, setCaseType, casesPage, setCasesPage, casesTotalPages, casesViewMode, setCasesViewMode
}: CasesTabContentProps) {

  const casesColumns: Column<StudentCaseItem>[] = [
    {
      header: "Patient",
      accessor: "patientName",
      render: (val, row) => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                <span className="text-white font-bold text-xs">{val.slice(0,2).toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{val}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1"><User size={10} /> {row.patientAge} years</span>
            </div>
        </div>
      )
    },
    {
      header: "Diagnosis",
      accessor: "diagnosisdto",
      render: (_, row) => {
          const sc = getCaseStatusConfig(row.processStatus || row.status);
          const StatusIcon = sc.icon || Activity;
          return (
              <div className="flex flex-col gap-1.5 items-start">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{row.diagnosisdto?.caseType || "Pending"}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
                      <StatusIcon size={10} className={sc.text} />
                      {row.processStatus || sc.label}
                  </span>
              </div>
          )
      }
    },
    {
      header: "University Info",
      accessor: "universityName",
      render: (val) => (
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
              <GraduationCap size={14} className="text-indigo-400" />
              {val || "—"}
          </div>
      )
    },
    {
      header: "Registered On",
      accessor: "createAt",
      render: (val) => (
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
              <Calendar size={14} className="text-amber-500" />
              {new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
      )
    },
    {
      header: "",
      accessor: "id",
      render: (val) => (
          <Link href={`/my-cases/${val}`} className="my-btn-outline px-3 py-1.5 text-xs float-right">
              View Details
          </Link>
      )
    }
  ];

  return (
    <motion.div
      key="cases"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Content Area */}
      {casesLoading ? (
         casesViewMode === 'grid' ? (
             <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 place-items-center">
                 {Array.from({ length: 6 }).map((_, i) => <MyCasesSkeleton key={i} />)}
             </div>
         ) : (
             <div className="space-y-4 pt-4"><div className="w-full h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" /><div className="w-full h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" /></div>
         )
      ) : cases.length === 0 ? (
         <MyCasesEmptyState message="No cases found in this category." />
      ) : (
          casesViewMode === 'grid' ? (
              <motion.div layout className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 place-items-center">
                  <AnimatePresence>
                      {cases.map((item, i) => {
                          const sc = getCaseStatusConfig(item.processStatus || item.status);
                          const StatusIcon = sc.icon || Activity;
                          return (
                              <motion.div
                                  key={item.id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.4, delay: i * 0.05, type: 'spring', bounce: 0.3 }}
                                  className="w-full flex justify-center h-full"
                              >
                                  <CaseCard 
                                      caseItem={mapStudentCaseToCaseItem(item)} 
                                      hideRequestButton={true}
                                      navigationPath="/my-cases"
                                      customBadge={
                                          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full p-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-none ring-1 ring-white/50 dark:ring-slate-700">
                                              <span className={`shrink-0 flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
                                                  {item.processStatus === 'In Progress' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                                  {item.processStatus !== 'In Progress' && <StatusIcon size={12} className={sc.text} />}
                                                  {item.processStatus || sc.label}
                                              </span>
                                          </div>
                                      }
                                  />
                              </motion.div>
                          );
                      })}
                  </AnimatePresence>
              </motion.div>
          ) : (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}>
                  <DataTable columns={casesColumns} data={cases} />
              </motion.div>
          )
      )}

      <Pagination 
          currentPage={casesPage} 
          totalPages={casesTotalPages} 
          hasPreviousPage={casesPage > 1}
          hasNextPage={casesPage < casesTotalPages}
          onPageChange={setCasesPage} 
      />
    </motion.div>
  );
}
