'use client';
import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import StudentDashboardScreen from "@/features/dashboard/screens/StudentDashboard.screen";
import DoctorDashboardScreen from "@/features/dashboard/screens/DoctorDashboard.screen";
import PatientDashboardScreen from "@/features/dashboard/screens/PatientDashboard.screen";
import { UserRole } from "@/config/navLinks";
import { getUserDetailsFromCookies } from "@/utils/sharedHelper";

export default function DashboardRenderer() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const roleFromRedux = useSelector(
        (state: RootState) => state.auth.role
    );

    const roleFromCookies = getUserDetailsFromCookies().userRole;

    const role = roleFromRedux
        ?? roleFromCookies
    const normalizedRole = role ? (role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()) as UserRole : "Patient";

    const dashboards = {
        Doctor: DoctorDashboardScreen,
        Student: StudentDashboardScreen,
        Patient: PatientDashboardScreen,
    };

    if (!mounted) return null;

    const Dashboard = dashboards[normalizedRole] ?? PatientDashboardScreen;
    return <Dashboard />;
}
