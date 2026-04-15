import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAvailableCases } from "../server/case.action";
import { CasesQueryParams } from "../types/caseCardProps.types";
import Cookies from "js-cookie";
import { useFilterCases } from "./useFilterCases";


export const useAvailableCases = () => {
    const token = (useSelector((state: RootState) => state.auth.token) || Cookies.get("token")) as string;

    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    // Build query params — extend this object when you need to send
    // server-side filters (PatientName, CaseType, Status, Gender, SortBy, SortDirection)
    const queryParams: CasesQueryParams = useMemo(() => ({
        Page: currentPage,
        PageSize: pageSize,
    }), [currentPage, pageSize]);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["availableCases", queryParams],
        queryFn: () => getAvailableCases(queryParams, token),
        enabled: !!token,
        placeholderData: (prev) => prev,   // keep previous data while new page loads
    });

    // Show toast on error
    useMemo(() => {
        if (isError) toast.error("Can't fetch cases");
    }, [isError]);

    // Derive items & pagination from the query response
    const cases = useMemo(() => data?.data?.items ?? [], [data]);
    const totalCount = data?.data?.totalCount ?? 0;
    const totalPages = data?.data?.totalPages ?? 1;
    const hasPreviousPage = data?.data?.hasPreviousPage ?? false;
    const hasNextPage = data?.data?.hasNextPage ?? false;

    // Unified client-side filter + sort (memoized — won't re-run on viewMode toggle)
    const { filters, handleFilterChange, clearFilters, sortConfig, handleSort, hasActiveFilters, filteredAndSortedCases } = useFilterCases(cases);

    return {
        cases,
        loading: isLoading,
        filters,
        handleFilterChange,
        clearFilters,
        sortConfig,
        handleSort,
        hasActiveFilters,
        viewMode,
        setViewMode,
        sortedCases: filteredAndSortedCases,
        refresh: refetch,
        pageSize,
        currentPage,
        totalCount,
        totalPages,
        hasPreviousPage,
        hasNextPage,
        onPageChange: setCurrentPage,
    };
};
