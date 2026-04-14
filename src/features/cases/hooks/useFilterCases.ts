import { useState, useMemo, useCallback } from "react";
import { CaseItem } from "../types/caseCardProps.types";

export type SortConfig = {
    key: string;
    direction: "asc" | "desc";
} | null;

export const useFilterCases = (cases: CaseItem[]) => {
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
        setSortConfig(null);
    }, []);

    const handleSort = useCallback((key: string) => {
        setSortConfig((prev) => {
            if (!prev || prev.key !== key) return { key, direction: "asc" };
            if (prev.direction === "asc") return { key, direction: "desc" };
            return null;
        });
    }, []);

    const hasActiveFilters = Object.values(filters).some((v) => v !== "") || sortConfig !== null;

    const filteredAndSortedCases = useMemo(() => {
        // 1. Filter
        let result = cases.filter((c) => {
            const nameFilter = filters["patientName"];
            const typeFilter = filters["caseType"];

            if (nameFilter && !c.patientName.toLowerCase().includes(nameFilter.toLowerCase())) return false;
            if (typeFilter && !(c.caseType?.name || "").toLowerCase().includes(typeFilter.toLowerCase())) return false;
            return true;
        });

        // 2. Sort
        if (sortConfig) {
            result = [...result].sort((a, b) => {
                let aVal: any;
                let bVal: any;

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

    return {
        filters,
        handleFilterChange,
        clearFilters,
        sortConfig,
        handleSort,
        hasActiveFilters,
        filteredAndSortedCases,
    };
};
