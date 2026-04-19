"use client";

import SendRequestSection from "./SendRequestSection";
import PendingRequestSection from "./PendingRequestSection";
import ScheduleSessionSection from "./ScheduleSessionSection";
import { PatientCase } from "@/features/cases/types/CaseDetails.types";
import { useStudentActions } from "@/features/cases/hooks/useStudentActions";
import SendRequestModal from "../../../CaseCard/SendRequestModal";

interface StudentActionsProps {
    patient: PatientCase;
    studentId: string | null;
    onRefetch: () => void;
}

export default function StudentActions({ patient, studentId, onRefetch }: StudentActionsProps) {
    const {
        showRequestModal, setShowRequestModal,
        showSessionForm,  setShowSessionForm,
        sessionDate,      setSessionDate,
        sessionLocation,  setSessionLocation,
        cancelLoading,    sessionLoading,
        isAssignedToMe,   hasRequest,   requestStatus,
        handleCancelRequest, handleCreateSession,
    } = useStudentActions(patient, onRefetch);

    return (
        <>
            {!isAssignedToMe && (
                <>
                    {!hasRequest && (
                        <SendRequestSection onSendRequest={() => setShowRequestModal(true)} />
                    )}
                    {hasRequest && (
                        <PendingRequestSection
                            requestStatus={requestStatus}
                            cancelLoading={cancelLoading}
                            onCancel={handleCancelRequest}
                        />
                    )}
                </>
            )}

            {isAssignedToMe && (
                <ScheduleSessionSection
                    showForm={showSessionForm}
                    sessionDate={sessionDate}
                    sessionLocation={sessionLocation}
                    sessionLoading={sessionLoading}
                    onToggleForm={setShowSessionForm}
                    onDateChange={setSessionDate}
                    onLocationChange={setSessionLocation}
                    onSubmit={handleCreateSession}
                />
            )}

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