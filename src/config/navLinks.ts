import { NavLink } from '@/components/types/navLinks.types';
import {
    LayoutDashboard,
    PlusCircle,
    User,
    ClipboardClock,
    List,
    ListCheck,
    Settings
} from 'lucide-react';

export const NAV_LINKS: Record<UserRole [0], NavLink[]> = {
    Doctor: [
        {
            name: "Dashboard", path: "/dashboard", icon: LayoutDashboard
        },
        {
            name: "Pending Cases", path: "/pending-cases", icon: ClipboardClock
        },
        {
            name: "Student List", path: "/my-student", icon: List
        },
        {
            name: "Profile", path: "/profile", icon: User
        },
        {
            name: "Settings", path: "/settings", icon: Settings
        },
    ],
    Student: [
        {
            name: "Dashboard", path: "/dashboard", icon: LayoutDashboard
        },
        {
            name: "Cases List", path: "/cases", icon: List
        },
        {
            name: "My Cases", path: "/my-cases", icon: ListCheck
        },
        {
            name: "Profile", path: "/profile", icon: User
        },
        {
            name: "Settings", path: "/settings", icon: Settings
        },
    ],
    Patient: [
        {
            name: "Dashboard", path: "/dashboard", icon: LayoutDashboard
        },
        {
            name: "Add My Case", path: "/add-case", icon: PlusCircle
        },
        {
            name: "Profile", path: "/profile", icon: User
        },
        {
            name: "Settings", path: "/settings", icon: Settings
        },
    ],
};

export type UserRole = 'Doctor' | 'Student' | 'Patient';