import SideNav from "@/components/ui/Sidebar";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <SideNav/>
            <main className="flex-1">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}