import api from "@/utils/api";

export const doctorService = {
    getDoctorProfile: async (id: string) => {
        const response = await api.get(`/Doctors/${id}`);
        return response.data;
    },
    getPendingRequests: async (page: number = 1, pageSize: number = 10) => {
        const response = await api.get(`/Doctors/my-requests`, {
            params: { page, pageSize }
        });
        return response.data;
    },
    updateDoctorProfile: async (id: string, data: { publicId: string; name: string; specialty: string; universityId: number }) => {
        const response = await api.put(`/Doctors/${id}`, data);
        return response.data;
    },
    deleteDoctorAccount: async (id: string) => {
        const response = await api.delete(`/Doctors/${id}`);
        return response.data;
    }
};
