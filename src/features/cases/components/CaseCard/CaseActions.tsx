"use client";

import { useState } from "react";
import { Eye, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import SendRequestModal from "./SendRequestModal";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface CaseActionsProps {
    caseId: string;
    patientName: string;
    caseType?: string | null;
    hideRequestButton?: boolean;
    navigationPath?: string;
}

export default function CaseActions({ caseId, patientName, caseType, hideRequestButton, navigationPath = "/cases" }: CaseActionsProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className={`flex items-center gap-2 mt-3 ${hideRequestButton ? 'justify-center w-full' : ''}`}>
                <button className={`my-btn-outline group/view ${hideRequestButton ? 'w-full' : ''}`} onClick={() => router.push(`${navigationPath}/${caseId}`)}>
                    <Eye size={15} className="group-hover/view:animate-pulse group-hover/view:animate-duration-1000 transition-all duration-300" />
                    {t.caseCardViewDetails}
                </button>
                {!hideRequestButton && (
                    <button className="my-btn px-2 group/req" onClick={() => setShowModal(true)}>
                        <Send size={15} className="group-hover/req:animate-bounce group-hover/req:animate-duration-1000 transition-all duration-300" />
                        {t.caseCardSendRequest}
                    </button>
                )}
            </div>

            {showModal && (
                <SendRequestModal caseId={caseId} patientName={patientName} caseType={caseType} onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
