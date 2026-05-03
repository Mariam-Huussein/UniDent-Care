"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { doctorDashboardService } from "@/features/dashboard/services/doctorDashboardService";
import { CaseItem } from "../types/caseCardProps.types";

const PAGE_SIZE = 9;

export function useDoctorCases(doctorId: string, activeTab: string) {
    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [search, setSearch] = useState("");
    const [caseType, setCaseType] = useState("");
    
    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Reset pagination when tab or filters change
    useEffect(() => {
        setPage(1);
    }, [activeTab, search, caseType]);

    const fetchCases = useCallback(async () => {
        if (!doctorId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // Map tab to status. Ensure backend expects these statuses or map them accordingly.
            let statusQuery = "";
            if (activeTab === "Under Review") statusQuery = "Pending";
            else if (activeTab === "In Progress") statusQuery = "InProgress";
            else if (activeTab === "Completed") statusQuery = "Completed";

            const res = await doctorDashboardService.getDoctorCases(doctorId, {
                status: statusQuery,
                search: search || undefined,
                caseType: caseType || undefined,
                page,
                pageSize: PAGE_SIZE,
            });
            
            if (res.success && res.data) {
                setCases(res.data.items || []);
                setTotalPages(res.data.totalPages || 1);
                setTotalCount(res.data.totalCount || 0);
            } else {
                setCases([]);
                setTotalPages(1);
                setTotalCount(0);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to load cases");
            setCases([]);
            setTotalPages(1);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [doctorId, activeTab, search, caseType, page]);

    useEffect(() => { fetchCases(); }, [fetchCases]);

    return {
        cases, 
        loading, 
        search, 
        setSearch, 
        caseType, 
        setCaseType, 
        page, 
        setPage, 
        totalPages, 
        totalCount, 
        refetchCases: fetchCases
    };
}
