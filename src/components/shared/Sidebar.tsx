'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, UserRole } from "@/config/navLinks";

export default function Sidebar() {
    const pathname = usePathname();
    const userRole: UserRole = 'student';
    const links = NAV_LINKS[userRole];

    return (
        <>
            <>
                <aside className="fixed bottom-0 left-0 w-full h-16 z-50 bg-white border-t border-gray-200 flex flex-row justify-between md:items-stretch items-center md:relative md:h-screen md:w-64 md:flex-col md:justify-start md:pt-4 md:border-r md:border-t-0 transition-all duration-300">
                    <div className="hidden md:flex px-4 mb-6 justify-center md:justify-start">
                        <h1 className="text-xl font-bold text-indigo-600">Unident Care</h1>
                    </div>

                    <nav className="w-full md:w-auto flex flex-row md:flex-col justify-around md:justify-start md:space-y-2 md:px-2">
                        {links.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;

                            return (
                                <Link
                                    href={item.path}
                                    key={item.path}
                                    className={`flex flex-col md:flex-row items-center justify-center md:justify-start py-2 md:py-3 px-1 md:px-3 gap-1 md:gap-3 rounded-none md:rounded-lg transition-all duration-200 group h-full md:h-auto flex-1 md:flex-none
                                    ${isActive
                                            ? "text-indigo-600 md:bg-indigo-50 md:border-r-4 border-t-2 md:border-t-0 border-indigo-600"
                                            : "text-slate-500 hover:text-indigo-600 md:hover:bg-gray-50 border-t-2 md:border-t-0 border-transparent"
                                        }`}
                                >
                                    <Icon
                                        size={22}
                                        className={`flex-shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`}
                                    />
                                    <span className="text-[10px] md:text-base font-medium md:block text-center">
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
            </>
        </>
    );
};