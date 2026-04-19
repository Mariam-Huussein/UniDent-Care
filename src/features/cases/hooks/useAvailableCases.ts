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

    // API filters - sent to backend
    const [apiFilters, setApiFilters] = useState<Record<string, string>>({});

    const queryParams: CasesQueryParams = useMemo(() => {
        const params: CasesQueryParams = {
            Page: currentPage,
            PageSize: pageSize,
        };

        if (apiFilters.patientName) params.PatientName = apiFilters.patientName;
        if (apiFilters.caseType) params.CaseType = apiFilters.caseType;
        if (apiFilters.gender) params.Gender = parseInt(apiFilters.gender) as 0 | 1;

        return params;
    }, [currentPage, pageSize, apiFilters]);

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: ["availableCases", queryParams],
        queryFn: () => getAvailableCases(queryParams, token),
        enabled: !!token,
        placeholderData: (prev) => prev,
    });

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
    const { filters: clientFilters, handleFilterChange: handleClientFilterChange, clearFilters: clearClientFilters, sortConfig, handleSort, hasActiveFilters: clientHasActiveFilters, filteredAndSortedCases } = useFilterCases(cases);

    const handleFilterChange = (key: string, value: string) => {
        setApiFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page when filtering
    };

    const clearFilters = () => {
        setApiFilters({});
        setCurrentPage(1);
    };

    const hasActiveFilters = Object.values(apiFilters).some((v) => v !== "") || clientHasActiveFilters;

    return {
        cases,
        loading: isPending,
        filters: apiFilters,
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
