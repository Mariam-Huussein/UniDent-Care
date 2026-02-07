import { ApiResponse } from "@/types/api";

export interface AuthData {
    token: string;
    roles: string[];
}

export type LoginResponse = ApiResponse<AuthData>;

export interface LoginRequest {
    email: string;
    password: string;
}