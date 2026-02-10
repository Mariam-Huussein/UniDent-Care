'use client';

import StudentDashboardScreen from "@/features/dashboard/screens/StudentDashboard.screen";
import DoctorDashboardScreen from "@/features/dashboard/screens/DoctorDashboard.screen";
import PatientDashboardScreen from "@/features/dashboard/screens/PatientDashboard.screen";

import { UserRole } from "@/config/navLinks";

export default function DashboardRenderer({ role }: { role: UserRole }) {
    switch (role) {
        case "doctor":
            return <DoctorDashboardScreen />;
        case "student":
            return <StudentDashboardScreen />;
        case "patient":
            return <PatientDashboardScreen />;
        default:
            return <PatientDashboardScreen />;
    }
}
