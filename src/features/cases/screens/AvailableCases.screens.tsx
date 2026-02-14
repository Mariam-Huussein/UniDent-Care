"use client";

import { useAvailableCases } from "../hooks/useAvailableCases";
import CasesHeader from "../components/AvailableCases/CasesHeader";
import CasesGrid from "../components/AvailableCases/CasesGrid";

const SORT_OPTIONS = ["Newest", "Oldest", "Most Sessions"];

export default function AvailableCasesScreen() {
    const {
        cases,
        loading,
        search,
        setSearch,
        sortBy,
        setSortBy,
        sortedCases,
    } = useAvailableCases();

    return (
        <div className="min-h-screen bg-gray-50/60 px-3 py-4 pb-20 sm:px-6 sm:py-6 md:pb-6 lg:px-10">

            {/* ── Modern Header & Controls ───────────────────────────────────── */}
            <CasesHeader totalCases={cases.length} showingCases={sortedCases.length} search={search}
                setSearch={setSearch}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOptions={SORT_OPTIONS}/>
            {/* ── Cases Grid ──────────────────────────────── */}
            <CasesGrid cases={sortedCases} loading={loading} search={search} setSearch={setSearch} />
        </div>
    );
}