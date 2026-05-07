import api from "@/utils/api";
import { LoginRequest, LoginResponse } from "../types";
import { ApiResponse } from "@/types/api";
import { PatientSignupValues } from "../schemas/patientSignupSchema";
import { DoctorSignupValues } from "../schemas/doctorSignupSchema";
import { StudentSignupPayload } from "../types/studentPayload.Types";

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(
            `/Auth/Login`,
            credentials
        );
        return response.data;
    },
    logout: async (): Promise<void> => {
        await api.post("/Auth/Logout");
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
    getUniversitiesLookup: async (): Promise<ApiResponse<{ id: string; name: string }[]>> => {
        const response = await api.get<ApiResponse<{ id: string; name: string }[]>>("/Universities/lookup");
        return response.data;
    },
    getCitiesLookup: async (): Promise<{ id: number; name_ar: string; name_en: string }[]> => {
        const response = await api.get<{ value: number; name: string }[]>("/Enum/cities");
        console.log("Cities API Response:", response.data);
        // Transform the API response to match the expected format
        return response.data.map(city => ({
            id: city.value,
            name_ar: city.name,
            name_en: city.name
        }));
    }
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