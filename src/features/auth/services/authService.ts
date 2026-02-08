import api from "@/utils/api";
import { LoginRequest, LoginResponse } from "../types";
import { email } from "zod";
import { ApiResponse } from "@/types/api";
import { PatientSignupValues } from "../schemas/patientSignupSchema";

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(
            `/Auth/login`,
            credentials
        );
        return response.data;
    },
    logout: async (): Promise<void> => {
        await api.post("/Auth/logout");
    },
    forgotPassword: async (email: string): Promise<ApiResponse<string>> => {
        const response = await api.post<ApiResponse<string>>("/Auth/forgot-password", { email })
        return response.data
    },
    resetPassword: async (data: any): Promise<ApiResponse<string>> => {
        const response = await api.post<ApiResponse<string>>("/Auth/reset-password", data)
        return response.data
    },
    registerPatient: async (data: PatientSignupValues): Promise<ApiResponse<any>> => {
        const response = await api.post<ApiResponse<any>>(
            `/Patients`,
            data
        );
        return response.data;
    }
};