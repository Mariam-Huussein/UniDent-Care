import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { getAvailableCases } from "../server/case.action";
import { CaseItem } from "../types/caseCardProps.types";
import Cookies from "js-cookie";


export const useAvailableCases = () => {
    const token = (useSelector((state: RootState) => state.auth.token) || Cookies.get("token")) as string;

    const [cases, setCases] = useState<CaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCaseType, setSelectedCaseType] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);
    const pageSize = 9;

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getAvailableCases(currentPage, pageSize, token, selectedCaseType || undefined);
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
    }, [currentPage, selectedCaseType]);

    const filteredCases = useMemo(() => {
        return cases.filter((c) => {
            const matchesSearch =
                c.patientName.toLowerCase().includes(search.toLowerCase()) ||
                (c.caseType?.name || "").toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [cases, search]);

    return {
        cases,
        loading,
        search,
        setSearch,
        selectedCaseType,
        setSelectedCaseType,
        viewMode,
        setViewMode,
        sortedCases: filteredCases,
        refresh: fetchData,
        pageSize,
        currentPage,
        totalPages,
        hasPreviousPage,
        hasNextPage,
        onPageChange: setCurrentPage
    };
};
