"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
    Send, XCircle, CalendarPlus, Loader2, Activity,
} from "lucide-react";
import { PatientCase } from "../../../types/CaseDetails.types";
import { cancelCaseRequest, createSession } from "../../../server/case.action";
import SendRequestModal from "../../CaseCard/SendRequestModal";

interface StudentActionsProps {
    patient: PatientCase;
    studentId: string | null;
    onRefetch: () => void;
}

export default function StudentActions({ patient, studentId, onRefetch }: StudentActionsProps) {
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showSessionForm, setShowSessionForm] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(false);
    const [sessionDate, setSessionDate] = useState("");
    const [sessionLocation, setSessionLocation] = useState("");

    const { userFlags } = patient;
    const isAssignedToMe = userFlags?.isAssignedToMe ?? false;
    const hasRequest = userFlags?.hasRequest ?? false;
    const requestId = userFlags?.requestId ?? "";
    const requestStatus = userFlags?.requestStatus ?? "";

    /* ── Cancel Request ── */
    const handleCancelRequest = async () => {
        if (!requestId || !studentId) return;
        setCancelLoading(true);
        try {
            const res = await cancelCaseRequest(requestId, studentId);
            if (res.success) {
                toast.success("Request cancelled successfully");
                onRefetch();
            } else {
                toast.error(res.message || "Failed to cancel request");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to cancel request");
        } finally {
            setCancelLoading(false);
        }
    };

    /* ── Create Session ── */
    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId || !sessionDate) return;
        setSessionLoading(true);
        try {
            const res = await createSession({
                studentId,
                patientCaseId: patient.id,
                sessionDate: new Date(sessionDate).toISOString(),
                location: sessionLocation,
            });
            if (res.success) {
                toast.success("Session created successfully");
                setShowSessionForm(false);
                setSessionDate("");
                setSessionLocation("");
                onRefetch();
            } else {
                toast.error(res.message || "Failed to create session");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to create session");
        } finally {
            setSessionLoading(false);
        }
    };

    return (
        <>
            {/* ── Case NOT assigned to me ── */}
            {!isAssignedToMe && (
                <>
                    {/* No request sent → Send Request */}
                    {!hasRequest && (
                        <div className="flex gap-3">
                            <button onClick={() => setShowRequestModal(true)} className="my-btn flex-1 py-3 group">
                                <Send size={15} className="group-hover:scale-110 transition-transform" />
                                Send Request
                            </button>
                        </div>
                    )}

                    {/* Request already sent → show status + Cancel button */}
                    {hasRequest && (
                        <div className="space-y-3">
                            <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200/60 dark:border-blue-800/50 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Send size={14} className="text-blue-500" />
                                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                                        Request {requestStatus}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCancelRequest}
                                disabled={cancelLoading}
                                className="my-btn-outline w-full py-3 group text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                            >
                                {cancelLoading ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={15} className="group-hover:scale-110 transition-transform" />
                                        Cancel Request
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* ── Case IS assigned to me → Schedule Session ── */}
            {isAssignedToMe && (
                <div className="space-y-3">
                    {!showSessionForm ? (
                        <button
                            onClick={() => setShowSessionForm(true)}
                            className="my-btn w-full py-3 group"
                        >
                            <CalendarPlus size={15} className="group-hover:scale-110 transition-transform" />
                            Schedule New Session
                        </button>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            onSubmit={handleCreateSession}
                            className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 space-y-3"
                        >
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                                <CalendarPlus size={14} className="text-blue-500" />
                                New Session
                            </h4>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    Date & Time <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    value={sessionDate}
                                    onChange={(e) => setSessionDate(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={sessionLocation}
                                    onChange={(e) => setSessionLocation(e.target.value)}
                                    placeholder="e.g. Clinic A - Room 3"
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowSessionForm(false)}
                                    className="my-btn-outline flex-1 py-2 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sessionLoading || !sessionDate}
                                    className={`my-btn flex-1 py-2 text-sm ${(sessionLoading || !sessionDate) ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {sessionLoading ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Activity size={14} />
                                            Create Session
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </div>
            )}

            {/* Send Request Modal */}
            {showRequestModal && (
                <SendRequestModal
                    caseId={patient.id}
                    patientName={patient.patientName}
                    caseType={patient.caseType}
                    onClose={() => {
                        setShowRequestModal(false);
                        onRefetch();
                    }}
                />
            )}
        </>
    );
}
