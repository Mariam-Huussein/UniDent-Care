export default function DashboardLayout({
  children,
  caseModal,
}: {
  children: React.ReactNode;
  caseModal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {caseModal}
    </>
  );
}
