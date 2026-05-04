import { UserRole } from "./navLinks";

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
    '/my-students-cases': ['Doctor'],
    '/pending-request': ['Doctor'],
    '/my-cases': ['Student','Patient'],
    '/add-case': ['ClinicalDoctor'],
    '/cases': ['Doctor', 'Student', 'ClinicalDoctor'],
    '/dashboard': ['Doctor', 'Student', 'Patient'],
    '/profile': ['Doctor', 'Student', 'Patient'],
    '/settings': ['Doctor', 'Student', 'Patient', 'ClinicalDoctor'],
};