import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getCaseById } from "../server/case.action";
import { CaseItem } from "../types/caseCardProps.types";

export const useCaseDetails = (caseId: string) => {
    const [caseItem, setCaseItem] = useState<CaseItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCase = async () => {
            if (!caseId) return;
            setLoading(true);
            try {
                const response = await getCaseById(caseId);
                if (response.success) {
                    setCaseItem(response.data);
                }
            } catch (err: any) {
                toast.error(err.message || "Failed to load case details");
            } finally {
                setLoading(false);
            }
        };

        fetchCase();
    }, [caseId]);

    return { caseItem, loading };
};
