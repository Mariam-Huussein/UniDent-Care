import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { getAvailableCases } from "../server/case.action";
import { CaseItem } from "../types/caseCardProps.types";

export const useAvailableCases = () => {
    const studentId = useSelector((state: RootState) => state.auth.user?.userId || "");

    const [cases, setCases] = useState<CaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("Newest");

    const fetchData = async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const response = await getAvailableCases(1, 10, studentId);
            if (response.success) {
                setCases(response.data);
            }
        } catch (err: any) {
            toast.error(err.message || "Can't fetch cases");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [studentId]);

    const filteredCases = useMemo(() => {
        return cases.filter((c) => {
            const matchesSearch =
                c.patientName.toLowerCase().includes(search.toLowerCase()) ||
                (c.caseType?.name || "").toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [cases, search]);

    const sortedCases = useMemo(() => {
        return [...filteredCases].sort((a, b) => {
            if (sortBy === "Newest") return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
            if (sortBy === "Oldest") return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
            if (sortBy === "Most Sessions") return b.totalSessions - a.totalSessions;
            return 0;
        });
    }, [filteredCases, sortBy]);

    return {
        cases,
        loading,
        search,
        setSearch,
        sortBy,
        setSortBy,
        sortedCases,
        refresh: fetchData
    };
};
