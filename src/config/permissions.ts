import { UserRole } from "./navLinks";

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
    '/my-student': ['Doctor'],
    '/pending-cases': ['Doctor'],
    '/my-cases': ['Student'],
    '/add-case': ['Patient'],
    '/cases': ['Doctor', 'Student'],
    '/dashboard': ['Doctor', 'Student', 'Patient'],
    '/profile': ['Doctor', 'Student', 'Patient'],
    '/settings': ['Doctor', 'Student', 'Patient'],
};