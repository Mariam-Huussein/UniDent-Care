"use client";

import { useState } from "react";
import { Eye, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import SendRequestModal from "./SendRequestModal";

interface CaseActionsProps {
    caseId: string;
    patientName: string;
    caseType?: string;
    hideRequestButton?: boolean;
}

export default function CaseActions({ caseId, patientName, caseType, hideRequestButton }: CaseActionsProps) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className={`flex items-center gap-2 mt-3 ${hideRequestButton ? 'justify-center w-full' : ''}`}>
                <button className={`my-btn-outline group/view ${hideRequestButton ? 'w-full' : ''}`} onClick={() => router.push(`/cases/${caseId}`)}>
                    <Eye size={15} className="group-hover/view:animate-pulse group-hover/view:animate-duration-1000 transition-all duration-300" />
                    View Details
                </button>
                {!hideRequestButton && (
                    <button className="my-btn px-2 group/req" onClick={() => setShowModal(true)}>
                        <Send size={15} className="group-hover/req:animate-bounce group-hover/req:animate-duration-1000 transition-all duration-300" />
                        Send Request
                    </button>
                )}
            </div>

            {showModal && (
                <SendRequestModal caseId={caseId} patientName={patientName} caseType={caseType} onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
