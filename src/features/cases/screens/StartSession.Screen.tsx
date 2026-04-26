"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCaseDetails } from "../hooks/useCaseDetails";
import { CaseProvider, useCase } from "../context/CaseContext";
import { SessionNoteItem } from "../types/Sessions.types";
import { addSessionNote } from "../server/sessionNotes.action";
import { updateSessionStatus } from "../server/sessions.action";
import ActionModal from "@/components/ui/ActionModal";

import SessionTopBar from "../components/StartSession/SessionTopBar";
import PatientSummaryCard from "../components/StartSession/PatientSummaryCard";
import SessionWorkspace from "../components/StartSession/SessionWorkspace";
import DentalImageGallery from "../components/CaseDetails/Clinical/DentalImageGallery";

interface StartSessionScreenProps {
    caseId: string;
    sessionId: string;
}

export default function StartSessionScreen({ caseId, sessionId }: StartSessionScreenProps) {
    const { patient, isLoading, refetch } = useCaseDetails(caseId);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">
                <div className="max-w-[1200px] mx-auto flex items-center justify-center min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Loader2 size={28} className="text-white animate-spin" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Loading Session</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Preparing your workspace...</p>
                        </div>
                    </motion.div>
                </div>
            </div>
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

/** Inner component that has access to CaseContext */
function SessionContent({ caseId, sessionId }: { caseId: string; sessionId: string }) {
    const { caseData: patient, getSessionById, sessionsLoading, refetchSessions } = useCase();
    const router = useRouter();
    const [notes, setNotes] = useState<SessionNoteItem[]>([]);
    const [noteLoading, setNoteLoading] = useState(false);
    const [endSessionLoading, setEndSessionLoading] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);

    // Get session from CaseContext
    const session = getSessionById(sessionId) || null;

    // Add a note
    const handleAddNote = useCallback(
        async (noteText: string, isPrivate: boolean, imageUrl?: string) => {
            setNoteLoading(true);
            try {
                const body = {
                    sessionId,
                    note: noteText,
                    isPrivate,
                    imageUrl: imageUrl || "",
                };
                const res = await addSessionNote(sessionId, body);
                if (res.success) {
                    toast.success("Note added successfully");
                    const newNote: SessionNoteItem = {
                        id: res.data || crypto.randomUUID(),
                        note: noteText,
                        isPrivate,
                        imageUrl,
                        createdAt: new Date().toISOString(),
                    };
                    setNotes((prev) => [...prev, newNote]);
                } else {
                    toast.error(res.message || "Failed to add note");
                }
            } catch (err: any) {
                toast.error(err.message || "Failed to add note");
            } finally {
                setNoteLoading(false);
            }
        },
        [sessionId]
    );

    if (sessionsLoading) {
        return (
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">
                <div className="max-w-[1200px] mx-auto flex items-center justify-center min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Loader2 size={28} className="text-white animate-spin" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Loading Session Data</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Fetching session details...</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">
            <div className="max-w-[1200px] mx-auto space-y-6">

                {/* ═══ Top Bar ═══ */}
                <SessionTopBar
                    patientName={patient?.patientName || ""}
                    sessionId={sessionId}
                    caseId={caseId}
                    onEndSession={() => setShowEndModal(true)}
                    endSessionLoading={endSessionLoading}
                    sessionStatus={session?.status}
                />

                {/* End Session Confirmation Modal */}
                <ActionModal
                    isOpen={showEndModal}
                    onClose={() => setShowEndModal(false)}
                    onAction={async () => {
                        setEndSessionLoading(true);
                        try {
                            const res = await updateSessionStatus(sessionId, {
                                sessionId,
                                status: "1", // 1 represents "Done" in the backend enum (0=Scheduled, 1=Done, 2=Cancelled, 3=Expired)
                            });
                            if (res.success) {
                                toast.success("Session completed successfully");
                                setShowEndModal(false);
                                refetchSessions();
                                router.push(`/my-cases/${caseId}`);
                            } else {
                                toast.error(res.message || "Failed to end session");
                            }
                        } catch (err: any) {
                            toast.error(err.message || "Failed to end session");
                        } finally {
                            setEndSessionLoading(false);
                        }
                    }}
                    title="End Session"
                    message="Are you sure you want to end this session? Make sure you have saved all your clinical notes before proceeding."
                    actionText="End Session"
                    cancelText="Continue Session"
                    isLoading={endSessionLoading}
                    variant="danger"
                />

                {/* ═══ Main Content ═══ */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key="session-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                            {/* LEFT — Patient Context */}
                            <div className="lg:col-span-5 space-y-5">
                                {patient && <PatientSummaryCard patient={patient} />}
                                {patient && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                    >
                                        <DentalImageGallery images={patient.imageUrls} compact />
                                    </motion.div>
                                )}
                            </div>

                            {/* RIGHT — Session Workspace */}
                            <div className="lg:col-span-7">
                                <SessionWorkspace
                                    session={session}
                                    notes={notes}
                                    onAddNote={handleAddNote}
                                    noteLoading={noteLoading}
                                />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
