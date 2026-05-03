import { useState } from "react";
import toast from "react-hot-toast";
import { evaluateSession } from "@/features/cases/server/sessions.action";
import { TimelineSessionItem } from "@/features/session/types/Sessions.types";

export function useSessionEvaluation(session: TimelineSessionItem, existing: boolean, onSuccess: () => void) {
    const [grade, setGrade] = useState<number>(session.grade ?? 15);
    const [note, setNote] = useState(session.doctorNote ?? "");
    const [isFinal, setIsFinal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (grade < 0 || grade > 20) {
            toast.error("Grade must be 0–20");
            return;
        }
        setLoading(true);
        try {
            const res = await evaluateSession(session.id, { grade, note, isFinalSession: isFinal });
            if (res.success) {
                toast.success(existing ? "Evaluation updated!" : "Session evaluated!");
                onSuccess();
            } else {
                toast.error(res.message || "Failed to submit");
            }
        } catch (e: any) {
            toast.error(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return {
        grade, setGrade,
        note, setNote,
        isFinal, setIsFinal,
        loading, handleSubmit
    };
}