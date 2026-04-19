import { useState, useCallback } from "react";
import { searchDoctorsByUsername } from "../server/case.action";
import { DoctorSearchResult } from "../types/caseCardProps.types";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export const useSearchDoctor = () => {
    const [results, setResults] = useState<DoctorSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    const search = useCallback(async (username: string = "") => {
        
        setLoading(true);
        try {
            const universityId = Cookies.get("university_id") || "";
            const response = await searchDoctorsByUsername(username, universityId);
            if (response.success && response.data && response.data.items) {
                setResults(response.data.items);
            } else {
                setResults([]);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to search doctors");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { results, loading, search };
};