import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { PatientCase } from "../types/CaseDetails.types";
import { cancelCaseRequest } from "../server/caseRequest.action";
import { cancelSession, createSession, updateSessionStatus } from "../server/sessions.action";
import { SessionBookingData } from "../../session/types/Sessions.types";
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

    // ── Cancel Session modal state ──
    const [showCancelSessionModal, setShowCancelSessionModal] = useState(false);
    const [cancelSessionLoading, setCancelSessionLoading] = useState(false);

    const { userFlags } = patient;
    const isAssignedToMe = userFlags?.isAssignedToMe ?? false;
    const hasRequest = userFlags?.hasRequest ?? false;
    const requestId = userFlags?.requestId ?? "";
    const requestStatus = userFlags?.requestStatus ?? "";

    // ── Auto-expire session if the scheduled day has passed ──
    useEffect(() => {
        if (scheduledSession) {
            const status = scheduledSession.status?.toLowerCase();
            // Only expire if still "scheduled" — never touch InProgress sessions
            if (status !== "scheduled") return;
            const sessionDate = new Date(scheduledSession.scheduledAt);
            sessionDate.setHours(0, 0, 0, 0); // Reset to start of day

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset to start of day

            if (sessionDate.getTime() < today.getTime()) {
                console.log("Auto-expiring session: ", scheduledSession.id);
                updateSessionStatus(scheduledSession.id, {
                    sessionId: scheduledSession.id,
                    status: 3, // Backend Enum value for Expired
                })
                    .then((res) => {
                        if (res.success) {
                            toast.success("Session has automatically expired");
                            refetchSessions();
                        } else {
                            toast.error("Failed to auto-expire session");
                        }
                    })
                    .catch((err) => {
                        console.error("Error auto-expiring session:", err);
                        toast.error("Error auto-expiring session: " + err.message);
                    });
            }
        }
    }, [scheduledSession, refetchSessions]);

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

    // ── Cancel Session ──
    const handleCancelSession = async () => {
        if (!scheduledSession) return;
        setCancelSessionLoading(true);
        try {
            const res = await cancelSession(scheduledSession.id);
            if (res.success) {
                toast.success("Session cancelled successfully");
                setShowCancelSessionModal(false);
                refetchSessions();
                onRefetch();
            } else {
                toast.error(res.message || "Failed to cancel session");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to cancel session");
        } finally {
            setCancelSessionLoading(false);
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

        // ── Cancel session ──
        showCancelSessionModal, setShowCancelSessionModal,
        cancelSessionLoading,
        handleCancelSession,
    };
}