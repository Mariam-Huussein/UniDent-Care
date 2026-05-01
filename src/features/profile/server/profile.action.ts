import axiosInstance from "@/utils/api";

export interface UpdatePatientPayload {
    publicId: string;
    fullName: string;
    phoneNumber: string;
    nationalId: string;
    birthDate: string;
    gender: number;
}

export interface UpdateStudentPayload {
    publicId: string;
    fullName: string;
    university: string;
    level: number;
}

export interface UpdateDoctorPayload {
    publicId: string;
    name: string;
    specialty: string;
    universityId: number;
}

export async function updatePatientProfile(id: string, payload: UpdatePatientPayload) {
    try {
        const response = await axiosInstance.put(`/Patients/${id}`, payload);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update patient profile");
    }
}

export async function updateStudentProfile(id: string, payload: UpdateStudentPayload) {
    try {
        const response = await axiosInstance.put(`/Students/${id}`, payload);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update student profile");
    }
}

export async function updateDoctorProfile(id: string, payload: UpdateDoctorPayload) {
    try {
        const response = await axiosInstance.put(`/Doctors/${id}`, payload);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update doctor profile");
    }
}
