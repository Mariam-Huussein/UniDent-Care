"use client";

import dynamic from "next/dynamic";
import type { ToothConditionGroup, ToothDetail } from "react-odontogram";
import { ToothPanelData } from "./ToothInfoPanel";
import { ToothData } from "@/features/cases/types/CaseDetails.types";
import { getToothStatusColor } from "@/features/cases/utils/CaseDetails.utils";
import { Lock } from "lucide-react";

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
    /** Called after every view-mode click so parent can reset chartKey → clears purple highlight */
    onAfterViewClick?: () => void;
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
    onAfterViewClick,
}: OdontogramChartProps) {
    return (
        <div className="relative">
            {/* Overlay when locked */}
            {isUnassigned && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Lock size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Chart locked — case not yet assigned
                    </p>
                </div>
            )}

            <div
                className={`relative rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 p-5 max-w-120 mx-auto overflow-x-auto odontogram-wrapper transition-all duration-300 shadow-sm ${
                    isUnassigned ? "opacity-40 pointer-events-none select-none" : ""
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
                            stroke-width: 2px !important;
                        }
                    `}</style>
                )}

                {/* Colour diagnosed teeth via CSS injection (works in both modes) */}
                {teethMap.size > 0 && (
                    <style>{
                        Array.from(teethMap.values())
                            .filter((t) => t.status !== "healthy")
                            .map((t) => {
                                const c = getToothStatusColor(t.status);
                                return `
                                    g[id="${t.number}"] path,
                                    g[id="${t.number}"] polygon,
                                    g[id="tooth-${t.number}"] path,
                                    g[id="tooth-${t.number}"] polygon {
                                        fill: ${c.fill} !important;
                                        stroke: ${c.stroke} !important;
                                        stroke-width: 1.5px !important;
                                    }
                                `;
                            })
                            .join("")
                    }</style>
                )}

                <ReactOdontogram
                    notation="FDI"
                    showTooltip
                    readOnly={false}
                    teethConditions={conditions}
                    defaultSelected={selected.map((s) => `teeth-${s.notations.fdi}`)}
                    onChange={(sel: ToothDetail[]) => {
                        if (!isDiagnosisActive) {
                            // View mode — open info panel for the clicked tooth
                            setTimeout(() => {
                                if (sel.length > 0) {
                                    const fdi = Number(sel[sel.length - 1].notations.fdi);
                                    onToothClick(fdi);
                                }
                                // Always reset chartKey after view-mode interaction
                                // so the library's purple selection highlight disappears
                                onAfterViewClick?.();
                            }, 0);
                            return;
                        }
                        // Edit mode (status === "Diagnosis"): build selection for diagnosis plan
                        setTimeout(() => onSelectionChange(sel), 0);
                    }}
                    showLabels
                    layout="circle"
                    tooltip={{
                        placement: "top",
                        content: (detail) => {
                            if (!detail) return null;
                            const toothNum = Number(detail.notations.fdi);

                            if (!isDiagnosisActive) {
                                const diagnosed = diagnosedTeethMap.get(toothNum);
                                if (diagnosed) {
                                    return (
                                        <div className="text-center px-1.5 space-y-1">
                                            <div className="font-bold text-sm">Tooth #{toothNum}</div>
                                            <div className="text-xs opacity-80 font-medium">{diagnosed.caseType}</div>
                                            <div className="text-[10px] opacity-60 italic">{diagnosed.diagnosisStage}</div>
                                            <div className="text-[10px] opacity-50 pt-1 border-t border-white/20">
                                                Click to view details
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div className="text-center px-1">
                                        <div className="font-bold text-sm">Tooth #{toothNum}</div>
                                        <div className="text-[10px] opacity-60 mt-0.5">No diagnosis recorded</div>
                                    </div>
                                );
                            }

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
        </div>
    );
}