"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_LINKS, UserRole } from "@/config/navLinks";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Cookies from "js-cookie";
import { FaTooth } from "react-icons/fa";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Sidebar() {
    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const pathname = usePathname();
    const { t, language } = useLanguage();
    const isRtl = language === "ar";

    useEffect(() => {
        setMounted(true);
    }, []);

    const roleFromRedux = useSelector(
        (state: RootState) => state.auth.role
    ) as UserRole | undefined;

    const userRole =
        roleFromRedux ?? (Cookies.get("user_role") as UserRole);

    if (!mounted) return null;
    if (!userRole) return null;

    const links = NAV_LINKS[userRole];

    const getLinkName = (englishName: string) => {
        const map: Record<string, string> = {
            "Dashboard": t.navDashboard,
            "Pending Cases": t.navPendingCases,
            "Student List": t.navStudentList,
            "Profile": t.navProfile,
            "Settings": t.navSettings,
            "Cases List": t.navCasesList,
            "My Cases": t.navMyCases,
            "Add My Case": t.navAddCase,
        };
        return map[englishName] || englishName;
    };

    return (
        <aside className={`fixed bottom-0 left-0 w-full h-20 z-50 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-sm flex flex-row justify-between md:items-stretch items-center md:sticky md:top-0 md:h-screen ${isExpanded ? 'md:w-64' : 'md:w-20'} md:flex-col md:justify-start md:pt-4 md:border-r ${isRtl ? 'md:border-l md:border-r-0' : ''} md:border-t-0 transition-all duration-300`}>
            {/* Desktop Header & Toggle */}
            <div className={`hidden md:flex items-center px-4 mb-6 relative w-full h-8 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                {isExpanded ? (
                    <div className="flex items-center gap-2 transition-opacity duration-300">
                        <FaTooth className="text-indigo-600 dark:text-indigo-500" size={20} />
                        <h1 className={`text-lg font-black text-slate-900 dark:text-white tracking-tight truncate ${isRtl ? 'font-arabic' : ''}`}>
                            UniDent <span className="text-indigo-600 dark:text-indigo-500">Care</span>
                        </h1>
                    </div>
                ) : (
                    <FaTooth className="text-indigo-600 dark:text-indigo-500 mx-auto transition-opacity duration-300" size={22} />
                )}
                
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`absolute top-0 flex items-center justify-center w-6 h-6 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 ${isExpanded ? (isRtl ? 'left-2' : 'right-2') : (isRtl ? '-left-3' : '-right-3')} border border-gray-200 dark:border-slate-700 shadow-sm`}
                    style={{ zIndex: 100 }}
                >
                    {isExpanded ? (isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />) : (isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />)}
                </button>
            </div>

            <nav className="w-full md:w-auto flex flex-row md:flex-col justify-around md:justify-start md:space-y-2 md:px-0.5 mt-2">
                {links.map((item) => {
                    const Icon = item.icon;
                    // Because link paths might match exactly or be prefixes (like /cases vs /cases/123) we'll do an exact match for dashboard, profile, settings, and prefix for cases
                    let isActive = pathname === item.path;
                    if (item.path !== '/' && item.path !== '/dashboard' && pathname.startsWith(item.path)) {
                        isActive = true;
                    }

                    return (
                        <Link
                            href={item.path}
                            key={item.path}
                            className={`flex flex-col md:flex-row items-center justify-center ${isExpanded ? 'md:justify-start px-1 md:px-4' : 'md:justify-center px-1 md:px-0'} py-2 md:py-3.5 gap-1 md:gap-3 rounded-none md:rounded-xl mx-1 transition-all duration-200 group h-full md:h-auto flex-1 md:flex-none
                            ${isActive
                                    ? "text-indigo-600 dark:text-indigo-400 md:bg-indigo-50 dark:md:bg-indigo-900/20 md:border-r-0 border-t-2 md:border-t-0 border-indigo-600 dark:border-indigo-400 font-bold"
                                    : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 md:hover:bg-gray-50 dark:md:hover:bg-slate-800/50 border-t-2 md:border-t-0 border-transparent font-medium"
                                }`}
                            title={!isExpanded ? getLinkName(item.name) : undefined}
                        >
                            <Icon 
                                size={20}
                                className={`shrink-0 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}
                            />
                            <span className={`text-[14px] md:text-md text-center transition-all duration-300 ${isExpanded ? 'md:block opacity-100 w-auto' : 'md:hidden opacity-0 md:w-0'}`}>
                                {getLinkName(item.name)}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}