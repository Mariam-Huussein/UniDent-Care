"use client";

import Sidebar from "@/components/shared/Sidebar";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const isRtl = language === "ar";
  
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 w-full overflow-x-hidden p-6 lg:p-10 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
