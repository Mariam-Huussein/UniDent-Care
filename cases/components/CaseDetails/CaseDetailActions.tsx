"use client";

import { Send } from "lucide-react";

interface CaseDetailActionsProps {
    caseId: string;
}

export default function CaseDetailActions({ caseId }: CaseDetailActionsProps) {
    return (
        <div className="flex items-center gap-3">
            <button className="my-btn px-2 group">
                <Send size={16} className="group-hover:animate-bounce group-hover:animate-duration-1000 transition-all duration-300" />
                Send Request
            </button>
        </div>
    );
}
