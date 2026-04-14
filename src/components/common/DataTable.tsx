"use client";

import { useState, useMemo } from "react";
import { ArrowDownAZ, ArrowUpZA, ArrowUpDown } from "lucide-react";

export type Column<T> = {
    header: string;
    accessor: keyof T;
    sortable?: boolean;
    searchable?: boolean;
    filterComponent?: (props: { value: string; onChange: (val: string) => void }) => React.ReactNode;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    filters?: Record<string, string>;
    onFilterChange?: (key: string, value: string) => void;
    sortConfig?: { key: string; direction: "asc" | "desc" } | null;
    onSort?: (key: string) => void;
};

type SortConfig<T> = {
    key: keyof T;
    direction: "asc" | "desc";
} | null;

export default function DataTable<T extends Record<string, any>>({
    columns,
    data,
    filters: externalFilters,
    onFilterChange: externalOnFilterChange,
    sortConfig: externalSortConfig,
    onSort: externalOnSort,
}: DataTableProps<T>) {
    const [internalFilters, setInternalFilters] = useState<Record<string, string>>({});
    const [internalSortConfig, setInternalSortConfig] = useState<SortConfig<T>>(null);

    const activeFilters = externalFilters !== undefined ? externalFilters : internalFilters;
    const activeSortConfig = externalSortConfig !== undefined ? externalSortConfig : internalSortConfig;

    const handleFilterChange = (key: string, value: string) => {
        if (externalOnFilterChange) {
            externalOnFilterChange(key, value);
        } else {
            setInternalFilters((prev) => ({ ...prev, [key]: value }));
        }
    };

    const handleSort = (key: keyof T) => {
        if (externalOnSort) {
            externalOnSort(String(key));
        } else {
            if (!internalSortConfig || internalSortConfig.key !== key) {
                setInternalSortConfig({ key, direction: "asc" });
            } else if (internalSortConfig.direction === "asc") {
                setInternalSortConfig({ key, direction: "desc" });
            } else {
                setInternalSortConfig(null);
            }
        }
    };

    const processedData = useMemo(() => {
        // Filter
        let filtered = data.filter((row) =>
            columns.every((col) => {
                const value = row[col.accessor];
                const filterValue = activeFilters[col.accessor as string];
                if (!filterValue) return true;
                return String(value).toLowerCase().includes(filterValue.toLowerCase());
            })
        );

        // Sort — skip if external sort is provided (data arrives pre-sorted)
        if (!externalOnSort && activeSortConfig) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[activeSortConfig.key as keyof T];
                const bValue = b[activeSortConfig.key as keyof T];
                if (aValue < bValue) return activeSortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return activeSortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [data, activeFilters, activeSortConfig, columns, externalOnSort]);

    return (
        <div className="w-full bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-white border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            {columns.map((col) => {
                                const isSorted = activeSortConfig && activeSortConfig.key === String(col.accessor);

                                const SortIcon = () => {
                                    if (!col.sortable) return null;
                                    return (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSort(col.accessor);
                                            }}
                                            className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors ml-auto"
                                            title={`Sort by ${col.header}`}
                                        >
                                            {isSorted ? (
                                                activeSortConfig?.direction === "asc" ? (
                                                    <ArrowUpZA size={14} className="text-blue-500" />
                                                ) : (
                                                    <ArrowDownAZ size={14} className="text-blue-500" />
                                                )
                                            ) : (
                                                <ArrowUpDown size={14} />
                                            )}
                                        </button>
                                    );
                                };

                                return (
                                    <th
                                        key={String(col.accessor)}
                                        className="px-4 py-3 text-left font-medium text-gray-700 align-bottom"
                                    >
                                        <div className="flex flex-col gap-2">
                                            {col.filterComponent ? (
                                                <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-1 w-full pl-1">
                                                    {col.filterComponent({
                                                        value: activeFilters[String(col.accessor)] || "",
                                                        onChange: (val) => handleFilterChange(String(col.accessor), val)
                                                    })}
                                                    <SortIcon />
                                                </div>
                                            ) : col.searchable ? (
                                                <div className="relative flex items-center group w-full border-b border-gray-200 pb-1 focus-within:border-blue-500 transition-colors">
                                                    <input
                                                        type="text"
                                                        placeholder={col.header}
                                                        className="w-full bg-transparent text-sm placeholder:text-gray-700 focus:outline-none focus:placeholder:text-gray-400 font-medium pb-0.5 px-1 transition-all"
                                                        value={activeFilters[String(col.accessor)] || ""}
                                                        onChange={(e) =>
                                                            handleFilterChange(
                                                                String(col.accessor),
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <SortIcon />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between w-full border-b border-transparent pb-1 px-1">
                                                    <span className="text-sm font-medium text-gray-700">{col.header}</span>
                                                    <SortIcon />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {processedData.length > 0 ? (
                            processedData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="group hover:bg-blue-50/50 transition-colors duration-200 cursor-default"
                                >
                                    {columns.map((col) => (
                                        <td key={`cell-${index}-${String(col.accessor)}`} className="p-4 text-gray-700">
                                            {row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                                    No data found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}