"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Briefcase, Send } from "lucide-react";
import { useMyCasesStudent } from "../hooks/useMyCasesStudent";

// Feature Components
import { CasesTabContent } from "../components/MyCasesStudent/CasesTabContent";
import { RequestsTabContent } from "../components/MyCasesStudent/RequestsTabContent";
import MyCasesHeader from "../components/MyCasesStudent/MyCasesHeader";

export default function MyCasesStudentScreen() {
  const {
    activeTab, setActiveTab,
    cases, casesLoading, caseType, setCaseType, casesPage, setCasesPage, casesTotalPages, casesTotalCount,
    requests, requestsLoading, requestStatus, setRequestStatus, requestsPage, setRequestsPage, requestsTotalPages, requestsTotalCount,
  } = useMyCasesStudent();

  // 1. Set default ViewMode to 'grid' for both tabs as requested
  const [casesViewMode, setCasesViewMode] = useState<"grid" | "table">("grid");
  const [requestsViewMode, setRequestsViewMode] = useState<"grid" | "table">("grid");
  const tabs = [
    { id: "cases", label: "Registered Cases", icon: Briefcase, count: casesTotalCount },
    { id: "requests", label: "My Requests", icon: Send, count: requestsTotalCount },
  ];
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">

      {/* ── Dashboard Header ── */}
      <MyCasesHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            casesTotalCount={casesTotalCount}
            requestsTotalCount={requestsTotalCount}
            caseType={caseType}
            setCaseType={setCaseType}
            casesLoading={casesLoading}
            casesViewMode={casesViewMode}
            setCasesViewMode={setCasesViewMode}
            requestsViewMode={requestsViewMode}
            setRequestsViewMode={setRequestsViewMode} />

      <AnimatePresence mode="wait">
        {activeTab === "cases" && (
          <CasesTabContent
            cases={cases}
            casesLoading={casesLoading}
            caseType={caseType}
            setCaseType={setCaseType}
            casesPage={casesPage}
            setCasesPage={setCasesPage}
            casesTotalPages={casesTotalPages}
            casesViewMode={casesViewMode}
            setCasesViewMode={setCasesViewMode}
          />
        )}
        {activeTab === "requests" && (
          <RequestsTabContent
            requests={requests}
            requestsLoading={requestsLoading}
            requestStatus={requestStatus}
            setRequestStatus={setRequestStatus}
            requestsPage={requestsPage}
            setRequestsPage={setRequestsPage}
            requestsTotalPages={requestsTotalPages}
            requestsViewMode={requestsViewMode}
            setRequestsViewMode={setRequestsViewMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}