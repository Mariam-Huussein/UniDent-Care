'use client';
import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

import StudentDashboardScreen from "@/features/dashboard/screens/StudentDashboard.screen";
import DoctorDashboardScreen from "@/features/dashboard/screens/DoctorDashboard.screen";
import PatientDashboardScreen from "@/features/dashboard/screens/PatientDashboard.screen";
import { UserRole } from "@/config/navLinks";
import Cookies from "js-cookie";

export default function DashboardRenderer() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const roleFromRedux = useSelector(
        (state: RootState) => state.auth.role
    );

    const role = roleFromRedux ?? (Cookies.get("user_role") as UserRole);
    const dashboards = {
        Doctor: DoctorDashboardScreen,
        Student: StudentDashboardScreen,
        Patient: PatientDashboardScreen,
    };

    if (!mounted) return null;

    const Dashboard = dashboards[role as UserRole] ?? PatientDashboardScreen;
    return <Dashboard />;
}
