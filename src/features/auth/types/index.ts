import { ApiResponse } from "@/types/api";

export type UserBase = {
    publicId: string;
    fullName: string;
    email: string;
    createAt: string;
};

export type StudentUser = UserBase & {
    university: string;
    universityId: string;
    level: number;
    totalRequests: number;
    approvedRequests: number;
    totalSessions: number;
};

export type DoctorUser = UserBase & {
    specialty: string;
    universityId: string;
    totalStudents: number;
    pendingRequests: number;
    approvedRequests: number;
};
// UserBase already has fullName, so I just need to remove 'name: string'

export type PatientUser = UserBase & {
    phone: string;
    age: number;
    totalCases: number;
    activeCases: number;
};

export type User = StudentUser | DoctorUser | PatientUser;

export interface AuthData<TUser = User> {
    token: string;
    roles: string[];
    publicId: string;
    user: TUser;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export type LoginResponse = ApiResponse<AuthData>;