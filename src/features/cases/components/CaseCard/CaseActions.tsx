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
            <button className="my-btn px-2 group/req">
                <Send size={15} className="group-hover/req:animate-bounce group-hover/req:animate-duration-1000 transition-all duration-300" />
                Send Request
            </button>
        </div>
    );
}
