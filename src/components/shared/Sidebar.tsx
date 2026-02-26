'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_LINKS, UserRole } from "@/config/navLinks";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Cookies from "js-cookie";


export default function Sidebar() {
    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const pathname = usePathname();

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
    return (
        <aside className={`fixed bottom-0 left-0 w-full h-16 z-50 bg-white border-t border-gray-100 shadow-sm flex flex-row justify-between md:items-stretch items-center md:sticky md:top-0 md:h-screen ${isExpanded ? 'md:w-64' : 'md:w-20'} md:flex-col md:justify-start md:pt-4 md:border-r md:border-t-0 transition-all duration-300`}>
            {/* Desktop Header & Toggle */}
            <div className={`hidden md:flex items-center px-4 mb-6 relative w-full h-8 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                {isExpanded ? (
                    <h1 className="text-xl font-bold text-indigo-600 truncate transition-opacity duration-300">
                        Unident Care
                    </h1>
                ) : (
                    <h1 className="text-xl font-bold text-indigo-600 mx-auto transition-opacity duration-300">
                        U
                    </h1>
                )}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`absolute top-0 flex items-center justify-center w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-all duration-300 ${isExpanded ? 'right-2' : '-right-3 border border-gray-200 shadow-sm'}`}
                    style={{ zIndex: 100 }}
                >
                    {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>

            <nav className="w-full md:w-auto flex flex-row md:flex-col justify-around md:justify-start md:space-y-2 md:px-0.5">
                {links.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            href={item.path}
                            key={item.path}
                            className={`flex flex-col md:flex-row items-center justify-center ${isExpanded ? 'md:justify-start px-1 md:px-3' : 'md:justify-center px-1 md:px-0'} py-2 md:py-3 gap-1 md:gap-3 rounded-none md:rounded-lg transition-all duration-200 group h-full md:h-auto flex-1 md:flex-none
                            ${isActive
                                    ? "text-indigo-600 md:bg-indigo-50 md:border-r-4 border-t-2 md:border-t-0 border-indigo-600"
                                    : "text-slate-500 hover:text-indigo-600 md:hover:bg-gray-50 border-t-2 md:border-t-0 border-transparent"
                                }`}
                            title={!isExpanded ? item.name : undefined}
                        >
                            <Icon
                                size={22}
                                className={`flex-shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`}
                            />
                            <span className={`text-[10px] md:text-base font-medium text-center transition-opacity duration-300 ${isExpanded ? 'md:block opacity-100 w-auto' : 'md:hidden opacity-0 md:w-0'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};