"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CaseStatus, DiagnosisStage, PatientCase, ToothStatus } from "../types/CaseDetails.types";
import { getCaseById } from "../server/case.action";
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
            const response = await getCaseById(caseId);
            if (response.success && response.data) {
                const apiData: CaseDetailData = response.data;

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
                    caseType: apiData.diagnosisdto?.caseType || "Unknown",
                    isPublic: apiData.isPublic,
                    universityId: apiData.universityId,
                    universityName: apiData.universityName,
                    createdAt: apiData.createAt,
                    imageUrls: apiData.imageUrls || [],
                    description: apiData.diagnosisdto?.notes || undefined,
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
                    diagnosisdto: apiData.diagnosisdto || null,

                    // Creator info
                    createdById: apiData.createdById,
                    createdByRole: apiData.createdByRole,

                    // User flags & actions
                    userFlags: apiData.userFlags,
                    availableActions: apiData.availableActions || [],

                    // Fields for existing components
                    medicalHistory: [],
                    medications: [],
                    gender: apiData.gender?.toString() || "Unknown",
                    student: undefined,
                    teeth: apiData.diagnosisdto?.teethNumbers?.map(num => ({
                        number: num,
                        status: 'needs-treatment' as ToothStatus,
                        notes: apiData.diagnosisdto?.notes || "",
                    })) || [],
                    timeline: [],
                    progressStep: mappedStatus === 'Completed' ? 4 : mappedStatus === 'InProgress' ? 3 : mappedStatus === 'Diagnosis' ? 2 : 1,
                    sessions: [],
                };

                setPatient(mappedPatient);
            } else {
                toast.error(response.message || "Failed to load case details.");
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
