import DashboardRenderer from "@/features/dashboard/screens/DashboardRenderer";

export default function DashboardPage() {
  const role = 'student';

  return <DashboardRenderer role={role} />;
}
