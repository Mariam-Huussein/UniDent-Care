import { ToothConditionGroup } from "react-odontogram";
import { DiagnosisDto } from "../types/caseCardProps.types";
import { ToothData } from "../types/CaseDetails.types";
import { getToothStatusColor } from "./CaseDetails.utils";
import { ToothPanelData } from "../components/CaseDetails/Clinical/OdontogramParts/ToothInfoPanel";

export function buildConditions(teeth: ToothData[]): ToothConditionGroup[] {
    const groups: Record<
        string,
        { teeth: string[]; outlineColor: string; fillColor: string; label: string }
    > = {};
    for (const t of teeth) {
        if (t.status === "healthy") continue;
        const colors = getToothStatusColor(t.status);
        if (!groups[t.status]) {
            groups[t.status] = { teeth: [], outlineColor: colors.stroke, fillColor: colors.fill, label: colors.label };
        }
        groups[t.status].teeth.push(`teeth-${t.number}`);
    }
    return Object.values(groups);
}

export function buildDiagnosedTeethMap(
    diagnosisdto: DiagnosisDto | null | undefined,
    assignedStudentName?: string | null,
    assignedDoctorName?: string | null
): Map<number, ToothPanelData> {
    const map = new Map<number, ToothPanelData>();
    if (!diagnosisdto) return map;
    for (const num of diagnosisdto.teethNumbers ?? []) {
        map.set(num, {
            toothNumber: num,
            caseType: diagnosisdto.caseType,
            diagnosisStage: diagnosisdto.diagnosisStage,
            notes: diagnosisdto.notes,
            assignedStudentName: assignedStudentName ?? null,
            assignedDoctorName: assignedDoctorName ?? null,
        });
    }
    return map;
}