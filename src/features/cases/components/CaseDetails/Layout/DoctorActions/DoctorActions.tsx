"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { PatientCase } from "../../../../types/CaseDetails.types";
import { approveRequest, rejectRequest } from "@/features/cases/server/caseRequest.action";
import PendingRequestCard from "./PendingRequestCard";
import EvaluationCard from "./EvaluationCard";
import { useCase } from "@/features/cases/context/CaseContext";

interface DoctorActionsProps {
    patient: PatientCase;
    onRefetch: () => void;
}

export default function DoctorActions({ patient, onRefetch }: DoctorActionsProps) {
    const { doctorRequests, doctorRequestsLoading, refetchDoctorRequests } = useCase();
    const [approveLoadingId, setApproveLoadingId] = useState<string | null>(null);
    const [rejectLoadingId, setRejectLoadingId] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Requests are already filtered by status=0 (Pending) from the API in CaseContext
    const pendingRequests = doctorRequests;

    // Keep currentIndex within bounds if pendingRequests changes (e.g. after reject/approve)
    useEffect(() => {
        if (currentIndex >= pendingRequests.length && pendingRequests.length > 0) {
            setCurrentIndex(Math.max(0, pendingRequests.length - 1));
        }
    }, [pendingRequests.length, currentIndex]);

    /* ── Approve ── */
    const handleApprove = async (id: string) => {
        setApproveLoadingId(id);
        try {
            const res = await approveRequest(id);
            if (res.success) {
                toast.success("Request approved successfully");
                onRefetch();
                refetchDoctorRequests();
            } else {
                toast.error(res.message || "Failed to approve request");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to approve request");
        } finally {
            setApproveLoadingId(null);
        }
    };

    /* ── Reject ── */
    const handleReject = async (id: string) => {
        setRejectLoadingId(id);
        try {
            const res = await rejectRequest(id);
            if (res.success) {
                toast.success("Request rejected");
                onRefetch();
                refetchDoctorRequests();
            } else {
                toast.error(res.message || "Failed to reject request");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to reject request");
        } finally {
            setRejectLoadingId(null);
        }
    };

    const currentRequest = pendingRequests[currentIndex];

    return (
        <>
            {/* ── Pending Request Carousel: Student info + Approve/Reject ── */}
            {(doctorRequestsLoading && pendingRequests.length === 0) ? (
                <div className="flex items-center justify-center py-6">
                    <Loader2 size={20} className="animate-spin text-slate-400" />
                </div>
            ) : pendingRequests.length > 0 && currentRequest && !patient.assignedStudentId ? (
                <div className="space-y-2">
                    {pendingRequests.length > 1 && (
                        <div className="flex items-center justify-between px-2 pt-2">
                            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                                Request {currentIndex + 1} of {pendingRequests.length}
                            </span>
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentIndex === 0}
                                    className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button 
                                    onClick={() => setCurrentIndex(prev => Math.min(pendingRequests.length - 1, prev + 1))}
                                    disabled={currentIndex === pendingRequests.length - 1}
                                    className="p-1 rounded-md text-slate-500 hover:bg-slate-200 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                    <PendingRequestCard
                        requestData={currentRequest as any}
                        approveLoading={approveLoadingId === currentRequest.id}
                        rejectLoading={rejectLoadingId === currentRequest.id}
                        onApprove={() => handleApprove(currentRequest.id)}
                        onReject={() => handleReject(currentRequest.id)}
                    />
                </div>
            ) : null}

            {/* ── Session needs evaluation ── */}
            {patient.userFlags?.isAssignedDoctor && patient.hasEvaluatedSession === false && patient.assignedStudentId && (
                <EvaluationCard />
            )}
        </>
    );
}
