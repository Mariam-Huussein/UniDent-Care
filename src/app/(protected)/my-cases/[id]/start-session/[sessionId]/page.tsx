import StartSessionScreen from "@/features/cases/screens/StartSession.Screen";

export default async function StartSession({
    params,
}: {
    params: Promise<{ id: string; sessionId: string }>;
}) {
    const { id, sessionId } = await params;

    return <StartSessionScreen caseId={id} sessionId={sessionId} />;
}