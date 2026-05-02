import StartSessionScreen from "@/features/session/Screens/StartSession.Screen";

export default async function StartSession({
    params,
}: {
    params: Promise<{ id: string; sessionId: string }>;
}) {
    const { id, sessionId } = await params;

    return <StartSessionScreen caseId={id} sessionId={sessionId} />;
}