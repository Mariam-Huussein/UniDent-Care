"use client";

import { CaseItem } from "../../types/caseCardProps.types";
import { InfoRow } from "./InfoRow";
import { getPatientInfoFields, getContactFields } from "../../utils/caseDetailInfo.utils";

interface CaseDetailInfoProps {
    caseItem: CaseItem;
}

export default function CaseDetailInfo({ caseItem }: CaseDetailInfoProps) {
    const patientFields = getPatientInfoFields(caseItem);
    const contactFields = getContactFields();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Patient Info</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {patientFields.map((field) => (
                        field.value !== null && <InfoRow key={field.label} {...field} />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {contactFields.map((field) => (
                        <InfoRow key={field.label} {...field} />
                    ))}
                </div>
            </div>
        </div>
    );
}
