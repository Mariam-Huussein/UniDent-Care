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
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

export default function Odontogram() {
    const { caseData, studentOwnerData, doctorOwnerData } = useCase();
    const patient = caseData as PatientCase;

    // ── Derive from context ────────────────────────────────────────────────
    const diagnosisdto        = patient?.diagnosisdto ?? null;
    const status              = patient?.status;
    const readonly            = status !== "Diagnosis";
    const assignedStudentName = studentOwnerData?.data?.fullName ?? null;
    const assignedDoctorName  = doctorOwnerData?.data?.fullName  ?? null;

    const teeth: ToothData[] = useMemo(() => {
        if (!diagnosisdto?.teethNumbers?.length) return [];
        return diagnosisdto.teethNumbers.map((num) => ({
            number: num,
            status: "needs-treatment" as ToothStatus,
            treatmentType: diagnosisdto.caseType || "",
            notes: diagnosisdto.notes || "",
        }));
    }, [diagnosisdto]);

    // ── Local state ────────────────────────────────────────────────────────
    const [selected, setSelected]   = useState<ToothDetail[]>([]);
    const [localTeeth, setLocalTeeth] = useState<ToothData[]>(teeth);
    const [panelData, setPanelData] = useState<ToothPanelData | null>(null);
    const [chartKey, setChartKey]   = useState(0);

    useEffect(() => { setLocalTeeth(teeth); }, [teeth]);

    // ── Derived ────────────────────────────────────────────────────────────
    const isDiagnosisActive = status === "Diagnosis" && !readonly;
    const isUnassigned      = status === "Pending";
    const hasDiagnosisData  = !!diagnosisdto && (diagnosisdto.teethNumbers?.length ?? 0) > 0;
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
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center text-center py-16 px-6 gap-4"
            >
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/20 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center shadow-sm">
                    <Stethoscope size={26} className="text-indigo-400 dark:text-indigo-500" />
                </div>
                <div className="max-w-xs">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        No Diagnosis Recorded
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">
                        No dental diagnosis has been submitted for this case yet. The chart will populate once a diagnosis plan is recorded.
                    </p>
                </div>
            </motion.div>
        );
    }

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