import { useState } from "react";
import { getUserDetailsFromCookies } from "@/utils/sharedHelper";
import { TimelineSessionItem } from "@/features/session/types/Sessions.types";

export default function useSessionCard(session: TimelineSessionItem, role: string | null) {
    const [showAllNotes, setShowAllNotes] = useState(false);
    const [showEvalForm, setShowEvalForm] = useState(false);

    const { userId } = getUserDetailsFromCookies();
    const isDoctor = role === "Doctor";
    const isDone = ["done", "completed"].includes(session.status?.toLowerCase());
    
    const hasEval = !(session.grade === 0 && !session.doctorNote?.trim());
    const isAssignedEvaluator = !session.evaluteDoctorId || session.evaluteDoctorId === userId;
    const canEvaluate = isDoctor && isDone && isAssignedEvaluator;

    const allMedias = session.notes.flatMap((n) => n.medias);
    const visibleNotes = showAllNotes ? session.notes : session.notes.slice(0, 2);
    const hasNotesText = session.notes.some((n) => n.note && n.note.trim() !== "");

    return {
        states: { showAllNotes, setShowAllNotes, showEvalForm, setShowEvalForm },
        computed: { isDone, hasEval, canEvaluate, allMedias, visibleNotes, hasNotesText }
    };
}