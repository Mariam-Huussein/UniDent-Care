import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { getAvailableCases } from "../server/case.action";
import { CaseItem } from "../types/caseCardProps.types";
import Cookies from "js-cookie";
import { useFilterCases } from "./useFilterCases";


export const useAvailableCases = () => {
    const token = (useSelector((state: RootState) => state.auth.token) || Cookies.get("token")) as string;

    const [cases, setCases] = useState<CaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const pageSize = 9;

    // Unified filter + sort
    const { filters, handleFilterChange, clearFilters, sortConfig, handleSort, hasActiveFilters, filteredAndSortedCases } = useFilterCases(cases);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getAvailableCases(currentPage, pageSize, token);
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
    }, [currentPage]);

    return {
        cases,
        loading,
        filters,
        handleFilterChange,
        clearFilters,
        sortConfig,
        handleSort,
        hasActiveFilters,
        viewMode,
        setViewMode,
        sortedCases: filteredAndSortedCases,
        refresh: fetchData,
        pageSize,
        currentPage,
        totalPages,
        hasPreviousPage,
        hasNextPage,
        onPageChange: setCurrentPage
    };
};
