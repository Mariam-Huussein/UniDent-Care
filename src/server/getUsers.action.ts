import { DoctorDataResponse, PatientDataResponse, StudentDataResponse } from "@/types/getUser.type";
import axiosInstance from "@/utils/api";


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
