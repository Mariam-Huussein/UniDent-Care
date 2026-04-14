"use client";

import { useAvailableCases } from "../hooks/useAvailableCases";
import CasesHeader from "../components/AvailableCases/CasesHeader";
import CasesGrid from "../components/AvailableCases/CasesGrid";
import CasesTable from "../components/AvailableCases/CasesTable";

export default function AvailableCasesScreen() {

    const {
        cases, loading, filters, handleFilterChange, clearFilters, hasActiveFilters,
        sortConfig, handleSort, viewMode, setViewMode, sortedCases,
        pageSize, currentPage, totalPages, hasPreviousPage, hasNextPage, onPageChange
    } = useAvailableCases();

    return (
        <div className="min-h-screen bg-gray-50/60 px-3 py-4 pb-20 sm:px-6 sm:py-6 md:pb-6 lg:px-10">

            <CasesHeader
                totalCases={cases.length}
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