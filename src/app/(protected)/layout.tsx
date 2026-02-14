import Sidebar from "@/components/shared/Sidebar";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
            <Sidebar />
            <main className="flex-1 min-w-0 w-full overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}