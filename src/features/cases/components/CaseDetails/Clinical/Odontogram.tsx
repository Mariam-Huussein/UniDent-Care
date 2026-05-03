"use client";

import { useState, useEffect, useMemo } from "react";
import type { ToothConditionGroup, ToothDetail } from "react-odontogram";
import "react-odontogram/style.css";

import { PatientCase, ToothData, ToothStatus } from "../../../types/CaseDetails.types";
import ToothInfoPanel, { ToothPanelData } from "./OdontogramParts/ToothInfoPanel";
import { buildConditions, buildDiagnosedTeethMap } from "@/features/cases/utils/odontogram.utils";
import OdontogramHeader from "./OdontogramParts/Odontogramheader";
import OdontogramChart from "./OdontogramParts/Odontogramchart";
import DiagnosisPlanPanel from "./OdontogramParts/Diagnosisplanpanel";
import { useCase } from "@/features/cases/context/CaseContext";
import OdontogramEmptyState from "./OdontogramParts/OdontogramEmptyState";

export default function Odontogram() {
    const { caseData, studentOwnerData, doctorOwnerData } = useCase();
    const DiagnosisFlag = false
    const patient = caseData as PatientCase;
    console.log(patient)

    // ── Derive from context ────────────────────────────────────────────────
    const diagnoses           = patient?.diagnoses ?? null;
    const status              = patient?.status;
    const readonly            = DiagnosisFlag;
    const assignedStudentName = studentOwnerData?.data?.fullName ?? null;
    const assignedDoctorName  = doctorOwnerData?.data?.fullName  ?? null;

    const teeth: ToothData[] = useMemo(() => {
        if (!diagnoses || !Array.isArray(diagnoses)) return [];
        return diagnoses.flatMap(d => (d.teethNumbers ?? []).map(num => ({
            number: num,
            status: "needs-treatment" as ToothStatus,
            treatmentType: d.caseTypeName || "",
            notes: d.notes || "",
        })));
    }, [diagnoses]);

    // ── Local state ────────────────────────────────────────────────────────
    const [selected, setSelected]   = useState<ToothDetail[]>([]);
    const [localTeeth, setLocalTeeth] = useState<ToothData[]>(teeth);
    const [panelData, setPanelData] = useState<ToothPanelData | null>(null);
    const [chartKey, setChartKey]   = useState(0);

    useEffect(() => { setLocalTeeth(teeth); }, [teeth]);

    // ── Derived ────────────────────────────────────────────────────────────
    const isDiagnosisActive = DiagnosisFlag && !readonly;
    const isUnassigned      = status === "Pending";
    const hasDiagnosisData  = !!diagnoses && diagnoses.length > 0;
    const showRightPanel    = isDiagnosisActive || hasDiagnosisData;

    const conditions: ToothConditionGroup[] = useMemo(
        () => buildConditions(localTeeth),
        [localTeeth]
    );

    const teethMap = useMemo(
        () => new Map(localTeeth.map((t) => [t.number, t])),
        [localTeeth]
    );

    const diagnosedTeethMap = useMemo(
        () => buildDiagnosedTeethMap(diagnoses, assignedStudentName, assignedDoctorName),
        [diagnoses, assignedStudentName, assignedDoctorName]
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
            const originalTooth = teeth.find((t) => t.number === fdiNum);
            if (originalTooth) return prev.map((t) => t.number === fdiNum ? originalTooth : t);
            return prev.filter((t) => t.number !== fdiNum);
        });
        setChartKey((k) => k + 1);
    };

    const handleClearAll = () => {
        setSelected([]);
        setLocalTeeth(teeth);
        setChartKey((k) => k + 1);
    };

    const handleToothClick = (toothNum: number) => {
        const data = diagnosedTeethMap.get(toothNum) ?? null;
        // Only open panel for diagnosed teeth; ignore clicks on undiagnosed teeth
        if (data) setPanelData(data);
    };

    /** Called by the chart after every view-mode click to reset visual selection */
    const handleAfterViewClick = () => setChartKey((k) => k + 1);

    // ── Empty state: no diagnosis recorded yet ─────────────────────────────
    if (!hasDiagnosisData && !isDiagnosisActive) {
        return (
            <OdontogramEmptyState/>
        );
    }

    console.log(patient)

    return (
        <div className={`grid grid-cols-1 gap-6 lg:gap-8 ${showRightPanel ? "lg:grid-cols-[1fr_340px]" : ""}`}>

            {/* ── Left: Header + Chart ── */}
            <div className="space-y-5">
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
                    onAfterViewClick={handleAfterViewClick}
                />
            </div>

            {/* ── Right: edit plan OR view info ── */}
            {showRightPanel && (
                <div className="lg:sticky lg:top-4 self-start">
                    {isDiagnosisActive ? (
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
                    )}
                </div>
            )}
        </div>
    );
}