"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import type { ToothConditionGroup, ToothDetail } from "react-odontogram";
import { Info } from "lucide-react";
import { ToothData } from "../../types/CaseDetails.types";
import { getToothStatusColor } from "../../utils/CaseDetails.utils";
import "react-odontogram/style.css";

const ReactOdontogram = dynamic(() => import("react-odontogram"), { ssr: false });

interface OdontogramProps {
    teeth: ToothData[];
    readonly?: boolean;
    status?: string;
}

/* Map our tooth data → react-odontogram's ToothConditionGroup[] format */
function buildConditions(teeth: ToothData[]): ToothConditionGroup[] {
    const groups: Record<string, { teeth: string[]; outlineColor: string; fillColor: string; label: string }> = {};

    for (const t of teeth) {
        const colors = getToothStatusColor(t.status);
        const key = t.status;
        if (!groups[key]) {
            groups[key] = { teeth: [], outlineColor: colors.stroke, fillColor: colors.fill, label: colors.label };
        }
        groups[key].teeth.push(`teeth-${t.number}`);
    }

    return Object.values(groups);
}

export default function Odontogram({ teeth, readonly = false, status }: OdontogramProps) {
    const [selected, setSelected] = useState<ToothDetail[]>([]);
    const [localTeeth, setLocalTeeth] = useState<ToothData[]>(teeth);

    useEffect(() => {
        setLocalTeeth(teeth);
    }, [teeth]);

    const conditions = buildConditions(localTeeth);
    const teethMap = new Map(localTeeth.map((t) => [t.number, t]));

    const handleUpdateTooth = (num: number, updates: Partial<ToothData>) => {
        setLocalTeeth((prev) => {
            const hasTooth = prev.some((t) => t.number === num);
            if (hasTooth) {
                return prev.map((t) => t.number === num ? { ...t, ...updates } : t);
            }
            return [...prev, { number: num, status: "needs-treatment", ...updates } as ToothData];
        });
    };

    const isDiagnosis = status === "diagnosis";
    const isUnassigned = status === "unassigned" || readonly;

    return (
        <div className={`grid grid-cols-1 ${isDiagnosis ? "lg:grid-cols-[1fr_380px]" : ""} gap-6 lg:gap-8`}>
            {/* Inject Global Styles for Selected Teeth Outlines */}
            {selected.length > 0 && (
                <style>{`
                    ${selected.map(s => `g[id="${s.notations.fdi}"] path, g[id="${s.notations.fdi}"] polygon, g[id="tooth-${s.notations.fdi}"] path`).join(", ")} {
                        stroke-dasharray: 4, 3 !important;
                        stroke-width: 1.5px !important;
                    }
                `}</style>
            )}

            {/* Left Column: Chart Area */}
            <div className="space-y-4">
                {/* Header + Legend */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center">
                            <Info size={18} className="text-indigo-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800">
                                {readonly ? "Diagnosis Chart" : "Interactive Odontogram"}
                            </h3>
                            <p className="text-[11px] text-gray-400">
                                {readonly ? "Chart is view-only prior to diagnosis" : "Click any tooth for details"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        {(["healthy", "needs-treatment", "in-progress", "treated"] as const).map((s) => {
                            const c = getToothStatusColor(s);
                            return (
                                <div key={s} className="flex items-center gap-1.5">
                                    <div
                                        className="w-3.5 h-3.5 rounded border shadow-sm"
                                        style={{ background: c.fill, borderColor: c.stroke }}
                                    />
                                    <span className="text-[11px] font-medium text-gray-500">{c.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Odontogram Chart */}
                <div className={`relative rounded-2xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 border border-gray-100/80 p-4 max-w-[450px] mx-auto overflow-x-auto odontogram-wrapper transition-all duration-300 ${isUnassigned ? "pointer-events-none opacity-60 grayscale-[20%]" : ""}`}>
                    <ReactOdontogram
                        notation="FDI"
                        showTooltip
                        teethConditions={conditions}
                        onChange={(sel: ToothDetail[]) => {
                            setTimeout(() => setSelected(sel), 0);
                        }}
                        showLabels
                        layout="circle"
                        tooltip={{
                            placement: "top",
                            content: (detail) => {
                                if (!detail) return null;
                                const toothNum = Number(detail.notations.fdi);
                                const t = teethMap.get(toothNum);
                                const statusLabel = t ? getToothStatusColor(t.status).label : "Healthy";
                                return (
                                    <div className="text-center px-1">
                                        <div className="font-bold text-sm mb-1">Tooth #{detail.notations.fdi}</div>
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

            {/* Right Column: Interactive Diagnosis Form List */}
            {isDiagnosis && (
                <div className="bg-white/60 backdrop-blur-md border border-gray-100/80 rounded-2xl p-5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] flex flex-col min-h-[400px] max-h-[600px] lg:max-h-[calc(100vh-250px)]">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-gray-800">Diagnosis Plan</h3>
                            <p className="text-[11px] text-gray-400">Selected teeth: {selected.length}</p>
                        </div>
                        {selected.length > 0 && (
                            <button onClick={() => setSelected([])} className="text-xs text-blue-500 hover:text-blue-700 font-medium">Clear All</button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto patient-details-scrollbar pr-1 space-y-4">
                        {selected.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                                    <Info size={20} className="text-blue-400" />
                                </div>
                                <h4 className="text-sm font-semibold text-gray-700">No teeth selected</h4>
                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">Click on the chart to select teeth and formulate a diagnosis plan.</p>
                            </div>
                        ) : (
                            selected.map((selTooth) => {
                                const fdiNum = Number(selTooth.notations.fdi);
                                const t = teethMap.get(fdiNum) || { number: fdiNum, status: "healthy" } as ToothData;

                                return (
                                    <div key={fdiNum} className="bg-white border text-left border-gray-200/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-7 h-7 rounded-md flex items-center justify-center border shadow-sm shrink-0"
                                                    style={{ background: getToothStatusColor(t.status).fill, borderColor: getToothStatusColor(t.status).stroke }}
                                                >
                                                    <span className="text-xs font-bold" style={{ color: getToothStatusColor(t.status).stroke }}>{fdiNum}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">Tooth #{fdiNum}</span>
                                            </div>
                                            <button
                                                onClick={() => setSelected(prev => prev.filter(p => Number(p.notations.fdi) !== fdiNum))}
                                                className="text-[10px] text-gray-400 hover:text-red-500 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* Status Select */}
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                                                <select
                                                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                                    value={t.status}
                                                    onChange={(e) => handleUpdateTooth(fdiNum, { status: e.target.value as any })}
                                                >
                                                    <option value="healthy">Healthy</option>
                                                    <option value="needs-treatment">Needs Treatment</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="treated">Treated</option>
                                                </select>
                                            </div>

                                            {/* Extra Fields if Unhealthy */}
                                            {t.status !== 'healthy' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="space-y-3 overflow-hidden"
                                                >
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Treatment Type</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. Root Canal, Extraction, Composite Filling"
                                                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                            value={t.treatmentType || ""}
                                                            onChange={(e) => handleUpdateTooth(fdiNum, { treatmentType: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Clinical Notes</label>
                                                        <textarea
                                                            placeholder="Add specific details, surfaces (e.g. MOD), or observations..."
                                                            rows={2}
                                                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                                            value={t.notes || ""}
                                                            onChange={(e) => handleUpdateTooth(fdiNum, { notes: e.target.value })}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
