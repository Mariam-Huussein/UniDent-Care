"use client";

import { useCaseDetails } from "../hooks/useCaseDetails";
import CaseDetailHeader from "../components/CaseDetails/CaseDetailHeader";
import CaseDetailImages from "../components/CaseDetails/CaseDetailImages";
import CaseDetailInfo from "../components/CaseDetails/CaseDetailInfo";
import CaseDetailActions from "../components/CaseDetails/CaseDetailActions";
import CaseDetailTabs from "../components/CaseDetails/CaseDetailTabs";
import CaseDetailSkeleton from "../components/CaseDetails/CaseDetailSkeleton";

interface CaseDetailsScreenProps {
    caseId: string;
}

export default function CaseDetailsScreen({ caseId }: CaseDetailsScreenProps) {
    const { caseItem, loading } = useCaseDetails(caseId);

    return (
        <div className="min-h-screen bg-gray-50/60 px-3 py-4 pb-20 sm:px-6 sm:py-6 md:pb-6 lg:px-10">
            <div className="max-w-5xl mx-auto space-y-6">
                {loading || !caseItem ? (
                    <CaseDetailSkeleton />
                ) : (
                    <>
                        <CaseDetailHeader
                            patientName={caseItem.patientName}
                            status={caseItem.status}
                        />

                        {/* White Container */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Images */}
                            <CaseDetailImages patientName={caseItem.patientName} />

                            {/* Top Section: Patient Info + Contact + Request Button */}
                            <div className="p-5 sm:p-6 border-b border-gray-100">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                                    <div className="flex-1">
                                        <CaseDetailInfo caseItem={caseItem} />
                                    </div>
                                    <div className="flex-shrink-0 self-start">
                                        <CaseDetailActions caseId={caseItem.id} />
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section: Tabs */}
                            <CaseDetailTabs />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}