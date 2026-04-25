import { CaseStatus, ToothStatus } from "../types/CaseDetails.types";

export function formatTimestamp(ts: string) {
    const d = new Date(ts);
    return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
}

type TabDef = { key: string; label: string };
export function getTabsForStatus(status: CaseStatus): TabDef[] {
    switch (status) {
        case "Pending":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "medical", label: "Medical Info" },
            ];
        case "Diagnosis":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "medical", label: "Medical Info" },
            ];
        case "InProgress":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "medical", label: "Medical Info" },
                { key: "timeline", label: "Timeline" },
            ];
        case "Completed":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "medical", label: "Medical Info" },
                { key: "timeline", label: "Timeline" },
            ];
        default:
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "medical", label: "Medical Info" },
            ];
    }
}

export function getPatientStatusConfig(status: CaseStatus) {
    switch (status) {
        case 'Pending':
            return {
                label: 'Unassigned',
                bg: 'bg-gray-100',
                text: 'text-gray-600',
                dot: 'bg-gray-400',
                border: 'border-gray-200',
                gradient: 'from-gray-400 to-gray-500',
            };
        case 'Diagnosis':
            return {
                label: 'Diagnosis',
                bg: 'bg-blue-50',
                text: 'text-blue-600',
                dot: 'bg-blue-400',
                border: 'border-blue-200',
                gradient: 'from-blue-400 to-blue-600',
            };
        case 'InProgress':
            return {
                label: 'In Progress',
                bg: 'bg-amber-50',
                text: 'text-amber-600',
                dot: 'bg-amber-400',
                border: 'border-amber-200',
                gradient: 'from-amber-400 to-orange-500',
            };
        case 'Completed':
            return {
                label: 'Completed',
                bg: 'bg-emerald-50',
                text: 'text-emerald-600',
                dot: 'bg-emerald-400',
                border: 'border-emerald-200',
                gradient: 'from-emerald-400 to-emerald-600',
            };
        default:
            return {
                label: status,
                bg: 'bg-gray-100',
                text: 'text-gray-600',
                dot: 'bg-gray-400',
                border: 'border-gray-200',
                gradient: 'from-gray-400 to-gray-500',
            };
    }
}

export function getToothStatusColor(status: ToothStatus) {
    switch (status) {
        case 'healthy': return { fill: '#e2e8f0', stroke: '#94a3b8', label: 'Healthy' };
        case 'needs-treatment': return { fill: '#fecaca', stroke: '#ef4444', label: 'Needs Treatment' };
        case 'in-progress': return { fill: '#fef08a', stroke: '#eab308', label: 'In Progress' };
        case 'treated': return { fill: '#bbf7d0', stroke: '#22c55e', label: 'Treated' };
    }
}

