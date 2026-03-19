"use client";

import { CaseCardProps } from "../../types/caseCardProps.types";
import CaseActions from "./CaseActions";
import CaseContent from "./CaseContent";
import CaseImageSwiper from "./CaseImageSwiper";

export default function CaseCard({ caseItem }: CaseCardProps) {
    return (
        <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden w-11/12 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
            {/* Image Swiper */}
            <CaseImageSwiper caseItem={caseItem} />

            {/* Content */}
            <div className="flex flex-col flex-1 p-3.5 sm:p-4">
                <CaseContent caseItem={caseItem} />
                <CaseActions caseId={caseItem.id} patientName={caseItem.patientName} caseType={caseItem.caseType?.name} />
            </div>
        </div>
    );
}
