"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, User, GraduationCap, Calendar } from "lucide-react";
import Link from "next/link";
import { CaseItem } from "../../types/caseCardProps.types";
import { StudentDashboardCaseItem } from "../../types/studentDashboard.types";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/pagination";
import CaseCard from "../CaseCard";
import { MyCasesSkeleton } from "./MyCasesSkeleton";
import { MyCasesEmptyState } from "./MyCasesEmptyState";
import { getCaseStatusConfig } from "./getCaseStatusConfig";
import { useState, useMemo } from "react";
import GridControlsToolbar from "../AvailableCases/GridControlsToolbar";
import { SortConfig } from "../../hooks/useFilterCases";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface CasesTabContentProps {
    cases: StudentDashboardCaseItem[];
    casesLoading: boolean;
    caseType: string;
    setCaseType: (val: string) => void;
    casesPage: number;
    setCasesPage: (val: number) => void;
    casesTotalPages: number;
    casesViewMode: "grid" | "table";
    setCasesViewMode: (val: "grid" | "table") => void;
}

const mapStudentCaseToCaseItem = (item: StudentDashboardCaseItem): CaseItem => {
    const firstDiagnosis = item.diagnosisdto?.[0];
    return {
        id: item.id,
        patientId: item.patientId,
        patientName: item.patientName,
        patientAge: item.patientAge,
        caseType: firstDiagnosis ? {
            publicId: firstDiagnosis.caseTypeId || "",
            name: firstDiagnosis.caseTypeName || firstDiagnosis.caseType || "",
            description: ""
        } : null,
        diagnosisdto: item.diagnosisdto,
        status: item.status,
        createAt: item.createAt,
        totalSessions: item.totalSessions,
        pendingRequests: item.pendingRequests,
        imageUrls: item.imageUrls,
        gender: undefined,
    };
};

export function CasesTabContent({
    cases, casesLoading, caseType, setCaseType, casesPage, setCasesPage, casesTotalPages, casesViewMode, setCasesViewMode
}: CasesTabContentProps) {
    const { t } = useLanguage();

    // --- Filter & Sort State ---
    const [filters, setFilters] = useState<Record<string, string>>({ caseType: caseType });
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        if (key === "caseType") {
            setCaseType(value);
            setCasesPage(1);
        }
    };

    const clearFilters = () => {
        setFilters({});
        setSortConfig(null);
        setCaseType("");
        setCasesPage(1);
    };

    const handleSort = (key: string) => {
        setSortConfig(prev => {
            if (!prev || prev.key !== key) return { key, direction: "asc" };
            if (prev.direction === "asc") return { key, direction: "desc" };
            return null;
        });
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== "") || sortConfig !== null;

    const filteredAndSortedCases = useMemo(() => {
        let result = cases.filter(c => {
            const nameFilter = filters["patientName"];
            const typeFilter = filters["caseType"];
            const statusFilter = filters["status"];

            if (nameFilter && !c.patientName.toLowerCase().includes(nameFilter.toLowerCase())) return false;
            if (typeFilter && !(c.diagnosisdto?.[0]?.caseTypeName || "").toLowerCase().includes(typeFilter.toLowerCase())) return false;

            if (statusFilter) {
                const currentStatus = c.processStatus || c.status;
                if (!currentStatus || currentStatus.toLowerCase() !== statusFilter.toLowerCase()) return false;
            }

            return true;
        });

        if (sortConfig) {
            result = [...result].sort((a, b) => {
                let aVal: any; let bVal: any;
                switch (sortConfig.key) {
                    case "patientName":
                        aVal = a.patientName.toLowerCase();
                        bVal = b.patientName.toLowerCase();
                        break;
                    case "patientAge":
                        aVal = a.patientAge;
                        bVal = b.patientAge;
                        break;
                    case "createAt":
                        aVal = new Date(a.createAt).getTime();
                        bVal = new Date(b.createAt).getTime();
                        break;
                    default:
                        aVal = (a as any)[sortConfig.key];
                        bVal = (b as any)[sortConfig.key];
                }
                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [cases, filters, sortConfig]);

    const casesColumns: Column<StudentDashboardCaseItem>[] = [
        {
            header: t.casesTablePatient,
            accessor: "patientName",
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                        <span className="text-white font-bold text-xs">{val.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{val}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <User size={10} /> {row.patientAge} {t.casesTableYears}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: t.myCasesDiagnosis,
            accessor: "diagnosisdto",
            render: (_, row) => {
                const sc = getCaseStatusConfig(row.status, t);
                const StatusIcon = sc.icon || Activity;
                return (
                    <div className="flex flex-col gap-1.5 items-start">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {row.diagnosisdto?.[0]?.caseTypeName || t.myCasesPending}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
                            <StatusIcon size={10} className={sc.text} />
                            {sc.label}
                        </span>
                    </div>
                );
            }
        },
        {
            header: t.myCasesUniversityInfo,
            accessor: "universityName",
            render: (val) => (
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <GraduationCap size={14} className="text-indigo-400" />
                    {val || "—"}
                </div>
            )
        },
        {
            header: t.myCasesRegisteredOn,
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
                    {t.myCasesViewDetails}
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
            <GridControlsToolbar
                filters={filters}
                onFilterChange={handleFilterChange}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                sortConfig={sortConfig}
                onSort={handleSort}
                hideGender={true}
                statusOptions={[
                    { label: t.toolbarAllStatuses, value: "" },
                    { label: t.toolbarInProgress,  value: "InProgress" },
                    { label: t.myCasesCompleted,   value: "Completed" },
                ]}
                defaultStatusLabel={t.toolbarAllStatuses}
            />

            {/* Content Area */}
            {casesLoading ? (
                casesViewMode === 'grid' ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 place-items-center">
                        {Array.from({ length: 6 }).map((_, i) => <MyCasesSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="space-y-4 pt-4">
                        <div className="w-full h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                        <div className="w-full h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                    </div>
                )
            ) : filteredAndSortedCases.length === 0 ? (
                <MyCasesEmptyState message={t.casesTableEmptyCategory} />
            ) : (
                casesViewMode === 'grid' ? (
                    <motion.div layout className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 place-items-center">
                        <AnimatePresence>
                            {filteredAndSortedCases.map((item, i) => {
                                const sc = getCaseStatusConfig(item.processStatus || item.status, t);
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                        <DataTable columns={casesColumns} data={filteredAndSortedCases} />
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
