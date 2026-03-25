"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CaseStatus, PatientCase } from "../types/CaseDetails.types";
import { getCaseById } from "../server/case.action";

interface UseCaseDetailsReturn {
    patient: PatientCase | null;
    isLoading: boolean;
    status: CaseStatus;
    role: string | null;
}

export function useCaseDetails(caseId: string): UseCaseDetailsReturn {
    const role = useSelector((state: RootState) => state.auth.role);
    const userId = useSelector((state: RootState) => state.auth.user?.publicId);
    const [patient, setPatient] = useState<PatientCase | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<CaseStatus>("unassigned");

    useEffect(() => {
        const fetchCaseData = async () => {
            if (!caseId) return;
            setIsLoading(true);
            try {
                const response = await getCaseById(caseId);
                if (response.success && response.data) {
                    const apiData: any = response.data;
                    
                    let mappedStatus = apiData.status?.toLowerCase() || "unassigned";
                    if (mappedStatus === 'inprogress') mappedStatus = 'in-progress';
                    
                    setStatus(mappedStatus as CaseStatus);

                    // Formulate matching PatientCase
                    const mappedPatient: PatientCase = {
                        id: apiData.id,
                        patientName: apiData.patientName,
                        patientAge: apiData.patientAge,
                        caseType: apiData.caseType?.name || apiData.caseType || "Unknown",
                        status: mappedStatus as CaseStatus,
                        createdAt: apiData.createAt || apiData.createdAt,
                        imageUrls: apiData.imageUrls || [],
                        description: apiData.caseType?.description || apiData.description,

                        medicalHistory: apiData.medicalHistory || ["Does not suffer from chronic diseases"],
                        medications: apiData.medications || ["No current medications"],
                        patientPhone: undefined,
                        patientCity: undefined,
                        student: ["diagnosis", "in-progress"].includes(mappedStatus) && userId ? {
                            id: userId,
                            name: "Current Student (Mock)",
                            phone: "01000000000",
                            email: "student@example.com",
                            university: "Mock University",
                            level: 4,
                        } : undefined,
                        teeth: [],
                        timeline: [],
                        progressStep: mappedStatus === 'completed' ? 4 : mappedStatus === 'in-progress' ? 3 : mappedStatus === 'diagnosis' ? 2 : 1,
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
        };

        fetchCaseData();
    }, [caseId]);

    return { patient, isLoading, status, role };
}
