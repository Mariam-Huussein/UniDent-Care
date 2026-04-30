import CaseDetailsScreen from "@/features/cases/screens/CaseDetails.Screen";

export default async function PendingCaseDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CaseDetailsScreen caseId={id} />;
}
