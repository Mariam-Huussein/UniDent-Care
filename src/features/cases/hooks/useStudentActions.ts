import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { PatientCase } from "../types/CaseDetails.types";
import { cancelCaseRequest } from "../server/caseRequest.action";
import { createSession } from "../server/sessions.action";
import { SessionBookingData } from "../types/Sessions.types";
import { useCase } from "../context/CaseContext";

export function useStudentActions(
    patient: PatientCase,
    onRefetch: () => void
) {
    const router = useRouter();
    const { scheduledSession, refetchSessions } = useCase();
    const studentId = Cookies.get("user_id");
    const [cancelLoading, setCancelLoading] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(false);
    const [sessionDate, setSessionDate] = useState("");
    const [sessionLocation, setSessionLocation] = useState("");
    const [showSessionForm, setShowSessionForm] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);

    // ── Start Now modal state ──
    const [showStartNowModal, setShowStartNowModal] = useState(false);
    const [startNowLoading, setStartNowLoading] = useState(false);

    const { userFlags } = patient;
    const isAssignedToMe = userFlags?.isAssignedToMe ?? false;
    const hasRequest = userFlags?.hasRequest ?? false;
    const requestId = userFlags?.requestId ?? "";
    const requestStatus = userFlags?.requestStatus ?? "";

    const handleCancelRequest = async () => {
        if (!requestId || !studentId) {
            toast.error("Invalid request or student ID");
            return;
        }
        setCancelLoading(true);
        try {
            const res = await cancelCaseRequest(requestId);
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

    const handleCreateSession = async (bookingData: SessionBookingData) => {
        if (!studentId) return;

        setSessionLoading(true);

        try {
            const bookingDateTime = new Date(bookingData.date);
            const [hours, minutes, seconds] = bookingData.startTime.split(":").map(Number);
            bookingDateTime.setHours(hours, minutes, seconds || 0);

            const res = await createSession({
                studentId,
                patientCaseId: patient.id,
                sessionDate: bookingDateTime.toISOString(),
                location: bookingData.location,
            });

            if (res.success) {
                toast.success("Session created successfully");
                setShowSessionForm(false);
                onRefetch();
                refetchSessions();
            } else {
                toast.error(res.message || "Failed to create session");
            }

        } catch (err: any) {
            toast.error(err.message || "Failed to create session");
        } finally {
            setSessionLoading(false);
        }
    };

    // ── Start Now: navigate to the start-session page ──
    // Status is NOT changed here. The student will mark it as "Done" via "End Session" button.
    const handleStartNow = async () => {
        if (!scheduledSession) return;
        setStartNowLoading(true);
        try {
            setShowStartNowModal(false);
            router.push(`/my-cases/${patient.id}/start-session/${scheduledSession.id}`);
        } finally {
            setStartNowLoading(false);
        }
    };

    return {
        showRequestModal, setShowRequestModal,
        showSessionForm, setShowSessionForm,
        sessionDate, setSessionDate,
        sessionLocation, setSessionLocation,
        cancelLoading,
        sessionLoading,

        isAssignedToMe,
        hasRequest,
        requestStatus,

        handleCancelRequest,
        handleCreateSession,

        // ── Scheduled session ──
        scheduledSession,
        showStartNowModal, setShowStartNowModal,
        startNowLoading,
        handleStartNow,
    };
}