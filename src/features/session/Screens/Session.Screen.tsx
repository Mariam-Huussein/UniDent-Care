"use client";

import { useCaseDetails } from "../../cases/hooks/useCaseDetails";
import { CaseProvider } from "../../cases/context/CaseContext";
import SessionContent from "../components/MainSession/SessionContent";
import SessionScreenSkeleton from "../components/MainSession/SessionScreenSkeleton";

interface SessionScreenProps {
    caseId: string;
    sessionId: string;
}

export default function SessionScreen({ caseId, sessionId }: SessionScreenProps) {
    const { patient, isLoading, refetch } = useCaseDetails(caseId);

    // Loading state
    if (isLoading) {
        return (
            <SessionScreenSkeleton />
        );
    }

    // Error state
    if (!patient) {
        return (
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">
                <div className="max-w-[1200px] mx-auto flex items-center justify-center min-h-[60vh]">
                    <p className="text-slate-500 dark:text-slate-400">Case not found.</p>
                </div>
            </div>
        );
    }

    return (
        <CaseProvider caseData={patient} caseId={caseId} isLoading={false} refetch={refetch}>
            <SessionContent caseId={caseId} sessionId={sessionId} />
        </CaseProvider>
    );
}
