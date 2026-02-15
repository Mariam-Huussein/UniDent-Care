import { User, Calendar, Send, Activity, Phone, Mail } from "lucide-react";
import { PiTooth } from "react-icons/pi";
import { CaseItem } from "../types/caseCardProps.types";
import { timeAgo } from "./caseCard.utils";

export function getPatientInfoFields(caseItem: CaseItem) {
    return [
        { icon: User, label: "Patient Name", value: caseItem.patientName, iconColor: "text-blue-500" },
        { icon: Activity, label: "Age", value: caseItem.patientAge > 0 ? `${caseItem.patientAge} Years` : null , iconColor: "text-emerald-500" },
        { icon: PiTooth, label: "Case Type", value: caseItem.caseType?.name || "Uncategorized", iconColor: "text-indigo-500" },
        { icon: Calendar, label: "Created", value: timeAgo(caseItem.createAt), iconColor: "text-amber-500" },
        { icon: Send, label: "Pending Requests", value: caseItem.pendingRequests, iconColor: "text-rose-500" },
    ];
}

export function getContactFields() {
    return [
        { icon: Phone, label: "Phone", value: "Not available", iconColor: "text-teal-500" },
        { icon: Mail, label: "Email", value: "Not available", iconColor: "text-sky-500" },
    ];
}
