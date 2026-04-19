"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserRole } from "@/config/navLinks";
import MyCasesPatientScreen from "@/features/cases/screens/MyCases.patient.screen";
import MyCasesStudentScreen from "@/features/cases/screens/MyCases.student.screen";
import Cookies from "js-cookie";

export default function MyCases() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const roleFromRedux = useSelector((state: RootState) => state.auth.role);
    const role = roleFromRedux ?? (Cookies.get("user_role") as UserRole);

    if (!mounted) return null;

    return role === "Patient" ? <MyCasesPatientScreen /> : <MyCasesStudentScreen />;
}
