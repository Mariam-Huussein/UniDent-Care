import { ApiResponse } from "./api";

interface StudentData {
  publicId: string;
  fullName: string;
  email: string;
  university: string;
  universityId: string;
  level: number;
  createAt: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  totalRequests: number;
  approvedRequests: number;
  totalSessions: number;
}

export type StudentDataResponse = ApiResponse<StudentData>;

export interface DoctorData {
    publicId: string;
    fullName: string;
    email: string;
    specialty: string;
    universityId: string;
    createAt: string;
    totalStudents: number;
    pendingRequests: number;
    approvedRequests: number;
}

export type DoctorDataResponse = ApiResponse<DoctorData>;

export interface PatientData {
    publicId: string;
    fullName: string;
    email: string;
    phone: string;
    age: number;
    createAt: string;
    patientCases: PatientCase[];
}

interface PatientCase {
    id: string;
    status: string;
    createAt: string;
    name: string;
}

export type PatientDataResponse = ApiResponse<PatientData>;