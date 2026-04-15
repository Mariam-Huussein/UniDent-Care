"use client";

import Sidebar from "@/components/shared/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 min-w-0 w-full overflow-x-hidden p-6 lg:p-10 pb-24 transition-all duration-300 md:mb-20">
        {children}
      </main>
    </div>
  );
}
