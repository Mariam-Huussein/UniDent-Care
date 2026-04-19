"use client";

import { useState, useMemo } from "react";
import { ArrowDownAZ, ArrowUpZA, ArrowUpDown } from "lucide-react";

export type Column<T> = {
    header: string;
    accessor: keyof T;
    render?: (val: any, row: T) => React.ReactNode;
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
    emptyStateComponent?: React.ReactNode;
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
    emptyStateComponent,
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
        <div className="w-full bg-white dark:bg-transparent rounded-xl shadow-sm dark:shadow-none ring-1 ring-gray-200/60 dark:ring-slate-800 overflow-hidden transition-colors">
            <div className="overflow-x-auto">
                <table className="w-full md:min-w-max text-sm text-left md:whitespace-nowrap">
                    <thead className="bg-white dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10 transition-colors">
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
                                            className="p-1 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 focus:outline-none transition-colors ml-auto"
                                            title={`Sort by ${col.header}`}
                                        >
                                            {isSorted ? (
                                                activeSortConfig?.direction === "asc" ? (
                                                    <ArrowUpZA size={14} className="text-blue-500 dark:text-blue-400" />
                                                ) : (
                                                    <ArrowDownAZ size={14} className="text-blue-500 dark:text-blue-400" />
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
                                        className="px-3.5 py-2.5 text-left font-medium text-gray-700 dark:text-slate-300 align-bottom transition-colors"
                                    >
                                        <div className="flex flex-col gap-1.5">
                                            {col.filterComponent ? (
                                                <div className="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-slate-700/50 pb-1 w-full pl-1 transition-colors">
                                                    {col.filterComponent({
                                                        value: activeFilters[String(col.accessor)] || "",
                                                        onChange: (val) => handleFilterChange(String(col.accessor), val)
                                                    })}
                                                    <SortIcon />
                                                </div>
                                            ) : col.searchable ? (
                                                <div className="relative flex items-center group w-full min-w-[120px] border-b border-gray-200 dark:border-slate-700/50 pb-1 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
                                                    <input
                                                        type="text"
                                                        placeholder={col.header}
                                                        className="w-full bg-transparent text-sm text-gray-900 dark:text-slate-200 placeholder:text-gray-700 dark:placeholder:text-slate-400 focus:outline-none focus:placeholder:text-gray-400 dark:focus:placeholder:text-slate-500 font-medium pb-0.5 px-1 transition-all"
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
                                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors">{col.header}</span>
                                                    <SortIcon />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60 transition-colors">
                        {processedData.length > 0 ? (
                            processedData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="group hover:bg-blue-50/50 dark:hover:bg-slate-800/40 transition-colors duration-200 cursor-default"
                                >
                                    {columns.map((col) => (
                                        <td 
                                            key={`cell-${index}-${String(col.accessor)}`} 
                                            className="px-3.5 py-[11px] text-gray-700 dark:text-slate-300 transition-colors"
                                        >
                                            {col.render ? col.render(row[col.accessor], row) : row[col.accessor] as React.ReactNode}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-0">
                                    {emptyStateComponent || (
                                        <div className="p-8 text-center text-gray-500 dark:text-slate-500 transition-colors">
                                            No data found matching your filters.
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}