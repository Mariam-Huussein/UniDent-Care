import { UserRole } from "./navLinks";

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
    '/my-student': ['doctor'],
    '/pending-cases': ['doctor'],
    '/my-cases': ['student'],
    '/add-case': ['patient'],
    '/cases': ['doctor', 'student'],
    '/dashboard': ['doctor', 'student', 'patient'],
    '/profile': ['doctor', 'student', 'patient'],
    '/settings': ['doctor', 'student', 'patient'],
};