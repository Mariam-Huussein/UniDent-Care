import api from "@/utils/api";

export const createCase = (data: {
    patientId: string;
    title: string;
    description: string;
    caseTypeId: string;
}) => {
    return api.post("/Cases", data);
};

export const getCaseTypes = (
    page: number = 1,
    pageSize: number = 10,
    search?: string,
) => {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
    });

    if (search) params.append("search", search);

    return api.get(`/CaseTypes?${params.toString()}`);
};