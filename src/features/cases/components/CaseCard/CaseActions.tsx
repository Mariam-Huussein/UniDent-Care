"use client";

import { BookUser, Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface CaseActionsProps {
    caseId: string;
}

export default function CaseActions({ caseId }: CaseActionsProps) {
    const router = useRouter();
    return (
        <div className="flex items-center gap-2 mt-3">
            <button className="my-btn-outline" onClick={() => router.push(`/cases/${caseId}`)}>
                <BookUser size={15} />
                View Details
            </button>
            <button className="my-btn">
                <Send size={15} />
                Send Request
            </button>
        </div>
    );
}
