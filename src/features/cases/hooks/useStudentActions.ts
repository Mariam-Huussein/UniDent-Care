import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { PatientCase } from "../types/CaseDetails.types";
import { cancelCaseRequest } from "../server/caseRequest.action";
import { createSession } from "../server/case.action";


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

    const { userFlags } = patient;
    const isAssignedToMe = userFlags?.isAssignedToMe ?? false;
    const hasRequest = userFlags?.hasRequest ?? false;
    const requestId = userFlags?.requestId ?? "";
    const requestStatus = userFlags?.requestStatus ?? "";

    const handleCancelRequest = async () => {
        if (!requestId || !studentId){
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

    return {
        showRequestModal, setShowRequestModal,
        showSessionForm,  setShowSessionForm,
        sessionDate,      setSessionDate,
        sessionLocation,  setSessionLocation,
        cancelLoading,
        sessionLoading,

        isAssignedToMe,
        hasRequest,
        requestStatus,

        handleCancelRequest,
        handleCreateSession,
    };
}