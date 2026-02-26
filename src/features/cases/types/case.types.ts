export type CreateCasePayload = {
    patientId: string;
    title: string;
    description: string;
    caseTypeId: string;
};

export type CaseType = {
    id: string;
    name: string;
};

export type CaseTypesResponse = {
    success: boolean;
    message: string;
    data: CaseType[];
    statusCode: number;
    warnings: null | string[];
    error: null | string;
    links: null;
};
