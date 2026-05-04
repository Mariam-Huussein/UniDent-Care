import { useState, useEffect, useCallback } from "react";
import { getDiagnosesByCaseId } from "../server/case.action";
import { DiagnosisDto } from "@/services/PatientDashboardAnalytics";

export function useDiagnoses(caseId: string | undefined) {
    const [diagnoses, setDiagnoses] = useState<DiagnosisDto[]>([]);
    const [loading, setLoading]     = useState(false);

    const fetch = useCallback(async () => {
        if (!caseId) return;
        setLoading(true);
        try {
            const res = await getDiagnosesByCaseId(caseId);
            if (res.success) setDiagnoses(res.data.items); 
        } finally {
            setLoading(false);
        }
    }, [caseId]);

    useEffect(() => { fetch(); }, [fetch]);

    return { diagnoses, loading, refresh: fetch };
}