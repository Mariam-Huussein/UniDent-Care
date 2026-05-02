"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCaseDetails } from "../../cases/hooks/useCaseDetails";
import { CaseProvider, useCase } from "../../cases/context/CaseContext";
import { SessionNoteItem } from "../types/Sessions.types";
import {
    addSessionNote,
    getSessionNotes,
    addNoteMedia,
} from "../../cases/server/sessionNotes.action";
import { updateSessionStatus } from "../../cases/server/sessions.action";
import ActionModal from "@/components/ui/ActionModal";
import SessionTopBar from "@/features/session/components/StartSession/SessionTopBar";
import PatientSummaryCard from "@/features/session/components/StartSession/PatientSummaryCard";
import DentalImageGallery from "@/features/cases/components/CaseDetails/Clinical/DentalImageGallery";
import SessionWorkspace from "@/features/session/components/StartSession/SessionWorkspace";

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
    const [notesLoading, setNotesLoading] = useState(true);
    const [noteLoading, setNoteLoading] = useState(false);
    const [endSessionLoading, setEndSessionLoading] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);

    const session = getSessionById(sessionId) || null;

    useEffect(() => {
        if (!session) return;
        const status = session.status?.toLowerCase();
        if (status === "scheduled") {
            updateSessionStatus(sessionId, {
                sessionId,
                status: "InProgress",
            })
                .then(() => refetchSessions())
                .catch(() => { /* silently ignore — user can still work */ });
        }
    }, [sessionId, session?.id]);

    // Fetch existing notes on mount
    useEffect(() => {
        let cancelled = false;
        setNotesLoading(true);
        getSessionNotes(sessionId)
            .then((res) => {
                if (cancelled) return;
                if (res.success && res.data) {
                    setNotes(res.data);
                }
            })
            .catch(() => {
                // silently fail — notes start empty
            })
            .finally(() => {
                if (!cancelled) setNotesLoading(false);
            });
        return () => { cancelled = true; };
    }, [sessionId]);

    // Add a note (text first, then upload media files)
    const handleAddNote = useCallback(
        async (noteText: string, files?: File[]) => {
            setNoteLoading(true);
            try {
                // 1. Create the note
                const res = await addSessionNote(sessionId, {
                    sessionId,
                    note: noteText,
                });

                if (!res.success || !res.data) {
                    toast.error(res.message || "Failed to add note");
                    return;
                }

                const createdNote: SessionNoteItem = { ...res.data, medias: res.data.medias ?? [] };

                // 2. Upload media files sequentially
                if (files && files.length > 0) {
                    const uploadToast = toast.loading(`Uploading ${files.length} file(s)…`);
                    const uploadedMedias = [...createdNote.medias];

                    for (const file of files) {
                        try {
                            const mediaRes = await addNoteMedia(sessionId, createdNote.id, file);
                            if (mediaRes.success && mediaRes.data) {
                                uploadedMedias.push(mediaRes.data);
                            }
                        } catch {
                            // continue uploading remaining files
                        }
                    }

                    createdNote.medias = uploadedMedias;
                    toast.dismiss(uploadToast);
                    toast.success("Note & media saved!");
                } else {
                    toast.success("Note added successfully");
                }

                setNotes((prev) => [...prev, createdNote]);
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
                                status: "Done",
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
                                    noteLoading={noteLoading || notesLoading}
                                />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
