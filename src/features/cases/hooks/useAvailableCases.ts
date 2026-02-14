import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { getAvailableCases } from "../server/case.action";
import { CaseItem } from "../types/caseCardProps.types";


export const useAvailableCases = () => {
    const studentId = useSelector((state: RootState) => state.auth.user?.userId || "");

    const [cases, setCases] = useState<CaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("Newest");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const pageSize = 9;

    const fetchData = async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const response = await getAvailableCases(currentPage, pageSize, studentId);
            if (response.success) {
                setCases(response.data.items);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
                setHasPreviousPage(response.data.hasPreviousPage);
                setHasNextPage(response.data.hasNextPage);
            }
        } catch (err: any) {
            toast.error(err.message || "Can't fetch cases");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [studentId, currentPage]);

    const filteredCases = useMemo(() => {
        return cases.filter((c) => {
            const matchesSearch =
                c.patientName.toLowerCase().includes(search.toLowerCase()) ||
                (c.caseType?.name || "").toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [cases, search]);

    const sortedCases = useMemo(() => {
        return [...filteredCases].sort((a, b) => {
            if (sortBy === "Newest") return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
            if (sortBy === "Oldest") return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
            if (sortBy === "Most Sessions") return b.totalSessions - a.totalSessions;
            return 0;
        });
    }, [filteredCases, sortBy]);

    return {
        cases,
        loading,
        search,
        setSearch,
        sortBy,
        setSortBy,
        sortedCases,
        refresh: fetchData,
        pageSize,
        currentPage,
        totalPages,
        hasPreviousPage,
        hasNextPage,
        onPageChange: setCurrentPage
    };
};
