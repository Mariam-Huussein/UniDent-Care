"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CaseStatus, DiagnosisStage, PatientCase, ToothStatus } from "../types/CaseDetails.types";
import { getCaseById, getDiagnosesByCaseId } from "../server/case.action";
import { CaseDetailData } from "../types/caseCardProps.types";

interface UseCaseDetailsReturn {
    patient: PatientCase | null;
    isLoading: boolean;
    status: CaseStatus;
    role: string | null;
    studentId: string | null;
    refetch: () => void;
}

export function useCaseDetails(caseId: string): UseCaseDetailsReturn {
    const role = useSelector((state: RootState) => state.auth.role);
    const studentId = useSelector((state: RootState) => state.auth.uinversalId ?? null);
    const [patient, setPatient] = useState<PatientCase | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<CaseStatus>("Pending");

    const fetchCaseData = useCallback(async () => { 
        if (!caseId) return;
        setIsLoading(true);
        try {
            const [caseResponse, diagnosesResponse] = await Promise.all([
                getCaseById(caseId),
                getDiagnosesByCaseId(caseId)
            ]);

            if (caseResponse.success && caseResponse.data) {
                const apiData: CaseDetailData = caseResponse.data;
                const diagnosesData = diagnosesResponse.success ? diagnosesResponse.data?.items || [] : [];

                let mappedStatus = apiData.status?.toLowerCase() || "Pending";
                if (mappedStatus === 'inprogress') mappedStatus = 'InProgress';

                setStatus(mappedStatus as CaseStatus);

                const mappedPatient: PatientCase = {
                    id: apiData.id,
                    patientId: apiData.patientId,
                    patientName: apiData.patientName,
                    patientAge: apiData.patientAge,
                    status: mappedStatus as CaseStatus,
                    processStatus: apiData.processStatus || "",
                    caseType: diagnosesData.length > 0 ? diagnosesData[0].caseTypeName || "Unknown" : "Unknown",
                    isPublic: apiData.isPublic,
                    universityId: apiData.universityId,
                    universityName: apiData.universityName,
                    createdAt: apiData.createAt,
                    imageUrls: apiData.imageUrls || [],
                    description: apiData.diagnoses[0]?.notes || null,
                    phone: apiData.phone,
                    city: apiData.city,
                    nationalId: apiData.nationalId,

                    // Sessions & tracking
                    totalSessions: apiData.totalSessions,
                    hasEvaluatedSession: apiData.hasEvaluatedSession,
                    pendingRequests: apiData.pendingRequests,

                    // Assignments
                    assignedStudentId: apiData.assignedStudentId || null,
                    assignedDoctorId: apiData.assignedDoctorId || null,

                    // Diagnosis
                    diagnoses: diagnosesData,

                    // Creator info
                    createdById: apiData.createdById,
                    createdByRole: apiData.createdByRole,

                    // User flags & actions
                    userFlags: apiData.userFlags,
                    availableActions: apiData.availableActions || [],
                    gender: "N/A",

                    // gender: apiData.gender,
                    // medicalHistory: [],
                    // medications: [],
                    // timeline: [],

                    student: undefined,
                    progressStep: apiData.processStatus,
                    sessions: [],
                };

                setPatient(mappedPatient);
            } else {
                toast.error(caseResponse.message || "Failed to load case details.");
            }
        } catch (err: any) {
            toast.error(err.message || "An error occurred while fetching.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [caseId]);

    useEffect(() => {
        fetchCaseData();
    }, [fetchCaseData]);

    return { patient, isLoading, status, role, studentId, refetch: fetchCaseData };
}
