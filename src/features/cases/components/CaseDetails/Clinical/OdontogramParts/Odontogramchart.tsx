"use client";

import dynamic from "next/dynamic";
import type { ToothConditionGroup, ToothDetail } from "react-odontogram";
import { ToothPanelData } from "./ToothInfoPanel";
import { ToothData } from "@/features/cases/types/CaseDetails.types";
import { getToothStatusColor } from "@/features/cases/utils/CaseDetails.utils";

const ReactOdontogram = dynamic(() => import("react-odontogram"), { ssr: false });

interface OdontogramChartProps {
    conditions: ToothConditionGroup[];
    teethMap: Map<number, ToothData>;
    diagnosedTeethMap: Map<number, ToothPanelData>;
    selected: ToothDetail[];
    isUnassigned: boolean;
    isDiagnosisActive: boolean;
    onSelectionChange: (selected: ToothDetail[]) => void;
    onToothClick: (toothNum: number) => void;
}

export default function OdontogramChart({
    conditions,
    teethMap,
    diagnosedTeethMap,
    selected,
    isUnassigned,
    isDiagnosisActive,
    onSelectionChange,
    onToothClick,
}: OdontogramChartProps) {
    return (
        <div
            className={`relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 max-w-[450px] mx-auto overflow-x-auto odontogram-wrapper transition-all duration-300 ${
                isUnassigned ? "pointer-events-none opacity-60" : ""
            }`}
        >
            {/* Dashed outline for selected teeth — edit mode only */}
            {isDiagnosisActive && selected.length > 0 && (
                <style>{`
                    ${selected.map((s) =>
                        `g[id="${s.notations.fdi}"] path,
                         g[id="${s.notations.fdi}"] polygon,
                         g[id="tooth-${s.notations.fdi}"] path`
                    ).join(", ")} {
                        stroke-dasharray: 4, 3 !important;
                        stroke-width: 1.5px !important;
                    }
                `}</style>
            )}

            <ReactOdontogram
                notation="FDI"
                showTooltip
                readOnly={!isDiagnosisActive}
                teethConditions={conditions}
                defaultSelected={selected.map((s) => `teeth-${s.notations.fdi}`)}
                onChange={(sel: ToothDetail[]) => {
                    if (!isDiagnosisActive) {
                        setTimeout(() => {
                            if (sel.length > 0) {
                                onToothClick(Number(sel[sel.length - 1].notations.fdi));
                            }
                        }, 0);
                        return;
                    }
                    setTimeout(() => onSelectionChange(sel), 0);
                }}
                showLabels
                layout="circle"
                tooltip={{
                    placement: "top",
                    content: (detail) => {
                        if (!detail) return null;
                        const toothNum = Number(detail.notations.fdi);

                        // View mode tooltip: show diagnosis summary if tooth is diagnosed
                        if (!isDiagnosisActive) {
                            const diagnosed = diagnosedTeethMap.get(toothNum);
                            if (diagnosed) {
                                return (
                                    <div className="text-center px-1 space-y-0.5">
                                        <div className="font-bold text-sm">Tooth #{toothNum}</div>
                                        <div className="text-xs opacity-80">{diagnosed.caseType}</div>
                                        <div className="text-[10px] opacity-60 italic">{diagnosed.diagnosisStage}</div>
                                        <div className="text-[10px] opacity-50 pt-0.5 border-t border-white/20">
                                            Click to view details 
                                        </div>
                                    </div>
                                );
                            }
                            // Undiagnosed tooth in view mode — minimal tooltip
                            return (
                                <div className="text-center px-1">
                                    <div className="font-bold text-sm">Tooth #{toothNum}</div>
                                    <div className="text-[10px] opacity-60 mt-0.5">No diagnosis recorded</div>
                                </div>
                            );
                        }

                        // Edit mode tooltip: show current local status
                        const t = teethMap.get(toothNum);
                        const statusLabel = t ? getToothStatusColor(t.status).label : "Healthy";
                        return (
                            <div className="text-center px-1">
                                <div className="font-bold text-sm mb-1">Tooth #{toothNum}</div>
                                <div className="flex items-center justify-center gap-1.5 opacity-90">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: t ? getToothStatusColor(t.status).stroke : "#cbd5e1" }}
                                    />
                                    <span className="text-xs">{statusLabel}</span>
                                </div>
                                {t?.treatmentType && (
                                    <div className="mt-1.5 pt-1.5 border-t border-white/20 text-[10px] opacity-80">
                                        {t.treatmentType}
                                    </div>
                                )}
                            </div>
                        );
                    },
                }}
            />
        </div>
    );
}