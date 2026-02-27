"use client";

import { useState, useMemo } from "react";
import { Search, ArrowDownAZ, ArrowUpZA, ArrowUpDown } from "lucide-react";

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
};

type SortConfig<T> = {
    key: keyof T;
    direction: "asc" | "desc";
} | null;

export default function DataTable<T extends Record<string, any>>({
    columns,
    data,
}: DataTableProps<T>) {
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSort = (key: keyof T) => {
        if (!sortConfig || sortConfig.key !== key) {
            // First click on a new column: sort ascending
            setSortConfig({ key, direction: "asc" });
        } else if (sortConfig.direction === "asc") {
            // Second click on the same column: sort descending
            setSortConfig({ key, direction: "desc" });
        } else {
            // Third click: remove sorting
            setSortConfig(null);
        }
    };

    const processedData = useMemo(() => {
        let filtered = data.filter((row) =>
            columns.every((col) => {
                const value = row[col.accessor];
                const filterValue = filters[col.accessor as string];

                if (!filterValue) return true;

                return String(value)
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
            })
        );

        if (sortConfig) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [data, filters, sortConfig, columns]);

    return (
        <div className="w-full bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-white border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                            {columns.map((col) => {
                                const isSorted =
                                    sortConfig && sortConfig.key === col.accessor;

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
                                                sortConfig?.direction === "asc" ? (
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
                                            {/* Unified Header / Filter Element */}
                                            {col.filterComponent ? (
                                                <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-1 w-full pl-1">
                                                    {col.filterComponent({
                                                        value: filters[String(col.accessor)] || "",
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
                                                        value={filters[String(col.accessor)] || ""}
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