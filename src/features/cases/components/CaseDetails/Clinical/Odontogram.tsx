"use client";

import { useState, useEffect, useMemo } from "react";
import type { ToothConditionGroup, ToothDetail } from "react-odontogram";
import "react-odontogram/style.css";

import { ToothData } from "../../../types/CaseDetails.types";
import { DiagnosisDto } from "../../../types/caseCardProps.types";
import ToothInfoPanel, { ToothPanelData } from "./OdontogramParts/ToothInfoPanel";
import { buildConditions, buildDiagnosedTeethMap } from "@/features/cases/utils/odontogram.utils";
import OdontogramHeader from "./OdontogramParts/Odontogramheader";
import OdontogramChart from "./OdontogramParts/Odontogramchart";
import DiagnosisPlanPanel from "./OdontogramParts/Diagnosisplanpanel";


interface OdontogramProps {
    teeth: ToothData[];
    readonly?: boolean;
    status?: string;
    diagnosisdto?: DiagnosisDto | null;
    assignedStudentName?: string | null;
    assignedDoctorName?: string | null;
}

export default function Odontogram({
    teeth,
    readonly = false,
    status,
    diagnosisdto,
    assignedStudentName,
    assignedDoctorName,
}: OdontogramProps) {
    const [selected, setSelected]     = useState<ToothDetail[]>([]);
    const [localTeeth, setLocalTeeth] = useState<ToothData[]>(teeth);
    const [panelData, setPanelData]   = useState<ToothPanelData | null>(null);
    const [chartKey, setChartKey]     = useState(0);

    useEffect(() => { setLocalTeeth(teeth); }, [teeth]);

    // ── Derived ────────────────────────────────────────────────────────────

    const isDiagnosisActive = status === "Diagnosis" && !readonly;
    const isUnassigned      = status === "Unassigned";
    const hasDiagnosisData  = !!diagnosisdto && (diagnosisdto.teethNumbers?.length ?? 0) > 0;

    const showRightPanel = isDiagnosisActive || hasDiagnosisData;

    const conditions: ToothConditionGroup[] = useMemo(
        () => (isDiagnosisActive ? buildConditions(localTeeth) : []),
        [isDiagnosisActive, localTeeth]
    );

    const teethMap = useMemo(
        () => new Map(localTeeth.map((t) => [t.number, t])),
        [localTeeth]
    );

    const diagnosedTeethMap = useMemo(
        () => buildDiagnosedTeethMap(diagnosisdto, assignedStudentName, assignedDoctorName),
        [diagnosisdto, assignedStudentName, assignedDoctorName]
    );

    // ── Handlers ───────────────────────────────────────────────────────────

    const handleUpdateTooth = (num: number, updates: Partial<ToothData>) => {
        setLocalTeeth((prev) => {
            const exists = prev.some((t) => t.number === num);
            if (exists) return prev.map((t) => t.number === num ? { ...t, ...updates } : t);
            return [...prev, { number: num, status: "needs-treatment", ...updates } as ToothData];
        });
    };

    const handleRemoveTooth = (fdiNum: number) => {
        setSelected((prev) => prev.filter((p) => Number(p.notations.fdi) !== fdiNum));
        setLocalTeeth((prev) => {
            const originalTooth = teeth.find(t => t.number === fdiNum);
            if (originalTooth) {
                return prev.map(t => t.number === fdiNum ? originalTooth : t);
            } else {
                return prev.filter(t => t.number !== fdiNum);
            }
        });
        setChartKey(k => k + 1);
    };

    const handleClearAll = () => {
        setSelected([]);
        setLocalTeeth(teeth);
        setChartKey(k => k + 1);
    };

    const handleToothClick = (toothNum: number) => {
        const data = diagnosedTeethMap.get(toothNum);
        setPanelData((prev) =>
            prev?.toothNumber === toothNum ? null : (data ?? null)
        );
    };

    return (
        <div className={`grid grid-cols-1 gap-6 lg:gap-8 ${showRightPanel ? "lg:grid-cols-[1fr_340px]" : ""}`}>

            {/* ── Left: Header + Chart ── */}
            <div className="space-y-4">
                <OdontogramHeader readonly={readonly} />
                <OdontogramChart
                    key={chartKey}
                    conditions={conditions}
                    teethMap={teethMap}
                    diagnosedTeethMap={diagnosedTeethMap}
                    selected={selected}
                    isUnassigned={isUnassigned}
                    isDiagnosisActive={isDiagnosisActive}
                    onSelectionChange={setSelected}
                    onToothClick={handleToothClick}
                />
            </div>

            {/* ── Right: edit plan OR view info ── */}
            {showRightPanel && (
                isDiagnosisActive ? (
                    <DiagnosisPlanPanel
                        selected={selected}
                        teethMap={teethMap}
                        onClearAll={handleClearAll}
                        onRemoveTooth={handleRemoveTooth}
                        onUpdateTooth={handleUpdateTooth}
                    />
                ) : (
                    <ToothInfoPanel
                        data={panelData}
                        onClose={() => setPanelData(null)}
                    />
                )
            )}
        </div>
    );
}