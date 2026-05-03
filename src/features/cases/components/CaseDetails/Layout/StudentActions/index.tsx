"use client";

import SendRequestSection from "./SendRequestSection";
import PendingRequestSection from "./PendingRequestSection";
import ScheduleSessionSection from "./ScheduleSessionSection";
import { PatientCase } from "@/features/cases/types/CaseDetails.types";
import { useStudentActions } from "@/features/cases/hooks/useStudentActions";
import SendRequestModal from "../../../CaseCard/SendRequestModal";

interface StudentActionsProps {
    patient: PatientCase;
    onRefetch: () => void;
}

export default function StudentActions({ patient, onRefetch }: StudentActionsProps) {
    const {
        showRequestModal, setShowRequestModal,
        showSessionForm,  setShowSessionForm,
        cancelLoading,    sessionLoading,
        isAssignedToMe,   hasRequest,   requestStatus,
        handleCancelRequest, handleCreateSession,
        scheduledSession,
        showStartNowModal, setShowStartNowModal,
        startNowLoading,
        handleStartNow,
        showCancelSessionModal, setShowCancelSessionModal,
        cancelSessionLoading,
        handleCancelSession,
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
                    sessionLoading={sessionLoading}
                    onToggleForm={setShowSessionForm}
                    onSubmit={handleCreateSession}
                    scheduledSession={scheduledSession}
                    showStartNowModal={showStartNowModal}
                    onToggleStartNowModal={setShowStartNowModal}
                    onStartNow={handleStartNow}
                    startNowLoading={startNowLoading}
                    showCancelSessionModal={showCancelSessionModal}
                    onToggleCancelSessionModal={setShowCancelSessionModal}
                    onCancelSession={handleCancelSession}
                    cancelSessionLoading={cancelSessionLoading}
                />
            )}

            {showRequestModal && (
                <SendRequestModal
                    caseId={patient.id}
                    patientName={patient.patientName}
                    caseType={patient.diagnoses ? patient.diagnoses[0].caseTypeName : "Uncategorized"}
                    onClose={() => {
                        setShowRequestModal(false);
                        onRefetch();
                    }}
                />
            )}
        </>
    );
}