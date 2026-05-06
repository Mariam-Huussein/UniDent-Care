import { DoctorDataResponse, PatientDataResponse, StudentDataResponse } from "@/types/getUser.type";
import axiosInstance from "@/utils/api";
import axios from "axios";
import Cookies from "js-cookie";

// v2 instance — token attached from cookie
const apiV2 = axios.create({ baseURL: "https://dental-hup1.runasp.net/api/v2/" });
apiV2.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export async function getMyProfile(): Promise<{ success: boolean; data: any }> {
    try {
        const response = await apiV2.get("Users/My-Profile");
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch profile");
    }
}


export async function getStudentById(id: string): Promise<StudentDataResponse> {
    try {
        const response = await axiosInstance.get(`Students/${id}`)
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to Find Student");
    }
}

export async function getDoctorById(id: string): Promise<DoctorDataResponse> {
    try {
        const response = await axiosInstance.get(`Doctors/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to Find Doctor");
    }
}

export async function getPatientById(id: string): Promise<PatientDataResponse> {
    try {
        const response = await axiosInstance.get(`Patients/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to Find Patient");
    }
}
