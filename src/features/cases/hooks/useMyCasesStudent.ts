"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { StudentCaseItem, StudentRequestItem } from "../types/caseCardProps.types";
import { getStudentMyCases, getStudentMyRequests } from "../server/case.action";

export type MyCasesTab = "cases" | "requests";

const PAGE_SIZE = 9;

export function useMyCasesStudent() {
    const [activeTab, setActiveTab] = useState<MyCasesTab>("cases");

    // Cases state
    const [cases, setCases] = useState<StudentCaseItem[]>([]);
    const [casesLoading, setCasesLoading] = useState(true);
    const [caseType, setCaseType] = useState("");
    const [casesPage, setCasesPage] = useState(1);
    const [casesTotalPages, setCasesTotalPages] = useState(1);
    const [casesTotalCount, setCasesTotalCount] = useState(0);

    // Requests state
    const [requests, setRequests] = useState<StudentRequestItem[]>([]);
    const [requestsLoading, setRequestsLoading] = useState(true);
    const [requestStatus, setRequestStatus] = useState("");
    const [requestsPage, setRequestsPage] = useState(1);
    const [requestsTotalPages, setRequestsTotalPages] = useState(1);
    const [requestsTotalCount, setRequestsTotalCount] = useState(0);

    const fetchCases = useCallback(async () => {
        setCasesLoading(true);
        try {
            const res = await getStudentMyCases({
                caseType: caseType || undefined,
                page: casesPage,
                pageSize: PAGE_SIZE,
            });
            if (res.success && res.data) {
                setCases(res.data.items);
                setCasesTotalPages(res.data.totalPages);
                setCasesTotalCount(res.data.totalCount);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to load cases");
        } finally {
            setCasesLoading(false);
        }
    }, [caseType, casesPage]);

    const fetchRequests = useCallback(async () => {
        setRequestsLoading(true);
        try {
            const res = await getStudentMyRequests({
                status: requestStatus || undefined,
                page: requestsPage,
                pageSize: PAGE_SIZE,
            });
            if (res.success && res.data) {
                setRequests(res.data.items);
                setRequestsTotalPages(res.data.totalPages);
                setRequestsTotalCount(res.data.totalCount);
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to load requests");
        } finally {
            setRequestsLoading(false);
        }
    }, [requestStatus, requestsPage]);

    useEffect(() => { fetchCases(); }, [fetchCases]);
    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    return {
        activeTab, setActiveTab,
        // cases
        cases, casesLoading, caseType, setCaseType, casesPage, setCasesPage,
        casesTotalPages, casesTotalCount, refetchCases: fetchCases,
        // requests
        requests, requestsLoading, requestStatus, setRequestStatus,
        requestsPage, setRequestsPage, requestsTotalPages, requestsTotalCount,
    };
}
