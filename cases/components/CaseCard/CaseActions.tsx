"use client";

import { useState } from "react";
import { BookUser, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import SendRequestModal from "./SendRequestModal";

interface CaseActionsProps {
    caseId: string;
    patientName: string;
    caseType?: string;
}

export default function CaseActions({ caseId, patientName, caseType }: CaseActionsProps) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="flex items-center gap-2 mt-3">
                <button className="my-btn-outline" onClick={() => router.push(`/cases/${caseId}`)}>
                    <BookUser size={15} />
                    View Details
                </button>
                <button className="my-btn px-2 group/req" onClick={() => setShowModal(true)}>
                    <Send size={15} className="group-hover/req:animate-bounce group-hover/req:animate-duration-1000 transition-all duration-300" />
                    Send Request
                </button>
            </div>

            {showModal && (
                <SendRequestModal caseId={caseId} patientName={patientName} caseType={caseType} onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
