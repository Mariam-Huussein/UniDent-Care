import ActionModal from "@/components/ui/ActionModal";
import { updateSessionStatus } from "@/features/cases/server/sessions.action";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import PatientSummaryCard from "./PatientSummaryCard";
import DentalImageGallery from "@/features/cases/components/CaseDetails/Clinical/DentalImageGallery";
import SessionWorkspace from "./SessionWorkspace";
import { SessionNoteItem, SessionStatus } from "../../types/Sessions.types";
import SessionTopBar from "./SessionTopBar";
import SessionContentSkeleton from "./SessionContentSkeleton";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useCase } from "@/features/cases/context/CaseContext";
import { addNoteMedia, addSessionNote, getSessionNotes } from "@/features/cases/server/sessionNotes.action";

export default function SessionContent({ caseId, sessionId }: { caseId: string; sessionId: string }) {
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
            <SessionContentSkeleton />
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
                        if (notes.length === 0) {
                            toast.error("You must add at least one clinical note before ending the session.");
                            setShowEndModal(false);
                            return;
                        }

                        setEndSessionLoading(true);
                        try {
                            const res = await updateSessionStatus(sessionId, {
                                sessionId,
                                status: "Done" as SessionStatus,
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
                    message={
                        notes.length === 0
                            ? "Warning: You haven't added any notes yet. Clinical notes are mandatory."
                            : "Are you sure you want to end this session? Make sure you have saved all your clinical notes before proceeding."
                    }
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
