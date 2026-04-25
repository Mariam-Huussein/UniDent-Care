import { DoctorDataResponse, PatientDataResponse, StudentDataResponse } from "@/types/getUser.type";
import axios, { AxiosRequestConfig } from "axios";
import { getTokens } from "@/utils/sharedHelper";


export async function getStudentById(id: string): Promise<StudentDataResponse> {
    const { cookieToken } = getTokens();
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Students/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to Find Student");
    }
}

export async function getDoctorById(id: string): Promise<DoctorDataResponse> {
    const { cookieToken } = getTokens();
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Doctors/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to Find Doctor");
    }
}

export async function getPatientById(id: string): Promise<PatientDataResponse> {
    const { cookieToken } = getTokens();
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Patients/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to Find Patient");
    }
}
