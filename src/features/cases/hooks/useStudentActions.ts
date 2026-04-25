import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { PatientCase } from "../types/CaseDetails.types";
import { cancelCaseRequest } from "../server/caseRequest.action";
import { createSession, getSessionsByCase, updateSessionStatus } from "../server/sessions.action";
import { SessionBookingData, SessionItem } from "../types/Sessions.types";

export function useStudentActions(
    patient: PatientCase,
    onRefetch: () => void
) {
    const studentId = Cookies.get("user_id");
    const [cancelLoading, setCancelLoading] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(false);
    const [sessionDate, setSessionDate] = useState("");
    const [sessionLocation, setSessionLocation] = useState("");
    const [showSessionForm, setShowSessionForm] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);

    // ── Scheduled session state ──
    const [scheduledSession, setScheduledSession] = useState<SessionItem | null>(null);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [showStartNowModal, setShowStartNowModal] = useState(false);
    const [startNowLoading, setStartNowLoading] = useState(false);

    const { userFlags } = patient;
    const isAssignedToMe = userFlags?.isAssignedToMe ?? false;
    const hasRequest = userFlags?.hasRequest ?? false;
    const requestId = userFlags?.requestId ?? "";
    const requestStatus = userFlags?.requestStatus ?? "";

    // ── Fetch sessions to detect "Scheduled" status ──
    const fetchSessions = useCallback(async () => {
        if (!patient.id || !isAssignedToMe) return;
        setSessionsLoading(true);
        try {
            const res = await getSessionsByCase(patient.id, 1, 50);
            if (res.success && res.data?.items) {
                const scheduled = res.data.items.find(
                    (s) => s.status?.toLowerCase() === "scheduled"
                );
                setScheduledSession(scheduled || null);
            }
        } catch (err) {
            console.error("Failed to fetch sessions:", err);
        } finally {
            setSessionsLoading(false);
        }
    }, [patient.id, isAssignedToMe]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

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
                fetchSessions();
            } else {
                toast.error(res.message || "Failed to create session");
            }

        } catch (err: any) {
            toast.error(err.message || "Failed to create session");
        } finally {
            setSessionLoading(false);
        }
    };

    // ── Start Now: update session status to "InProgress" ──
    const handleStartNow = async () => {
        if (!scheduledSession) return;
        setStartNowLoading(true);
        try {
            const res = await updateSessionStatus(scheduledSession.id, {
                sessionId: scheduledSession.id,
                status: "InProgress",
            });
            if (res.success) {
                toast.success("Session started successfully");
                setShowStartNowModal(false);
                setScheduledSession(null);
                onRefetch();
                fetchSessions();
            } else {
                toast.error(res.message || "Failed to start session");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to start session");
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
        sessionsLoading,
        showStartNowModal, setShowStartNowModal,
        startNowLoading,
        handleStartNow,
    };
}