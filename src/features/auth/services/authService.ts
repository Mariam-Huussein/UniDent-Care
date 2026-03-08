import api from "@/utils/api";
import { LoginRequest, LoginResponse } from "../types";
import { ApiResponse } from "@/types/api";
import { PatientSignupValues } from "../schemas/patientSignupSchema";
import { DoctorSignupValues } from "../schemas/doctorSignupSchema";
import { StudentSignupPayload } from "../types/studentPayload.Types";

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            console.log("Attempting Login with:", { ...credentials, password: "***" });
            const response = await api.post<LoginResponse>(
                `/Auth/Login`,
                credentials,
                {
                    headers: {
                        Authorization: "", // Ensure no existing token is sent
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("Login Error Details:", error.response?.data || error.message);
            throw error;
        }
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
    },
    registerDoctor: async (data: DoctorSignupValues): Promise<ApiResponse<any>> => {
        const response = await api.post<ApiResponse<any>>("/Doctors", data);
        return response.data;
    },
    registerStudent: async (data: StudentSignupPayload): Promise<ApiResponse<any>> => {
        const response = await api.post<ApiResponse<any>>("/Students", data);
        return response.data;
    },
};


export const getProfileByRole = async (role: string, userId: string) => {
    switch (role) {
        case "Student": {
            const res = await api.get(`/Students/${userId}`);
            return res.data.data;
        }

        case "Doctor": {
            const res = await api.get(`/Doctors/${userId}`);
            return res.data.data;
        }

        case "Patient": {
            const res = await api.get(`/Patients/${userId}`);
            return res.data.data;
        }

        default:
            throw new Error("Unknown role");
    }
};