"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { PatientCaseItem } from "../types/caseCardProps.types";
import { getPatientMyCases } from "../server/case.action";

const PAGE_SIZE = 9;

export function useMyCasesPatient(patientId: string) {
    const [cases, setCases] = useState<PatientCaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    
    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchCases = useCallback(async () => {
        if (!patientId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await getPatientMyCases(patientId, {
                search: search || undefined,
                status: status || undefined,
                page,
                pageSize: PAGE_SIZE,
            });
            if (res.success && res.data) {
                setCases(res.data.items);
                setTotalPages(res.data.totalPages);
                setTotalCount(res.data.totalCount);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to load cases");
        } finally {
            setLoading(false);
        }
    }, [patientId, search, status, page]);

    useEffect(() => { fetchCases(); }, [fetchCases]);

    return {
        cases, 
        loading, 
        search, 
        setSearch, 
        status, 
        setStatus, 
        page, 
        setPage, 
        totalPages, 
        totalCount, 
        refetchCases: fetchCases
    };
}
