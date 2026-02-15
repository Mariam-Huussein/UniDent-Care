import CaseDetailsScreen from "@/features/cases/screens/CaseDetails.Screen";
import { use } from "react";

export default function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <CaseDetailsScreen caseId={id} />
    );
}
