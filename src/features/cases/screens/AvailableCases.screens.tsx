"use client";

import { useAvailableCases } from "../hooks/useAvailableCases";
import CasesHeader from "../components/AvailableCases/CasesHeader";
import CasesGrid from "../components/AvailableCases/CasesGrid";
import CasesTable from "../components/AvailableCases/CasesTable";

export default function AvailableCasesScreen() {

    const {
        cases, loading, filters, handleFilterChange, clearFilters, hasActiveFilters,
        sortConfig, handleSort, viewMode, setViewMode, sortedCases,
        pageSize, currentPage, totalCount, totalPages, hasPreviousPage, hasNextPage, onPageChange
    } = useAvailableCases();

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">

            <CasesHeader
                totalCases={totalCount}
                showingCases={sortedCases.length}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {viewMode === 'grid' ? (
                <CasesGrid
                    cases={sortedCases}
                    loading={loading}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    clearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    hasPreviousPage={hasPreviousPage}
                    hasNextPage={hasNextPage}
                    onPageChange={onPageChange}
                />
            ) : (
                <CasesTable
                    cases={sortedCases}
                    loading={loading}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    clearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    hasPreviousPage={hasPreviousPage}
                    hasNextPage={hasNextPage}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}