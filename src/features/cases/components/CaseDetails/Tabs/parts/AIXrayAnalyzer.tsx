"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Scan, AlertTriangle, CheckCircle, Loader2, X, ImageIcon, RotateCcw } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

/* ── Types ─────────────────────────────────────────────────────── */
interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

interface Detection {
    class_name: string;
    confidence: number;
    box: BoundingBox;
}

interface AnalysisResponse {
    image_width: number;
    image_height: number;
    detections: Detection[];
}

/* ── Color Map — keys match exact class_name from the API ──────── */
const CLASS_COLORS: Record<string, { border: string; bg: string; text: string; solid: string }> = {
    "Infection":        { border: "border-red-500",    bg: "bg-red-500/20",    text: "text-red-400",    solid: "bg-red-600"    },
    "Fractured Teeth":  { border: "border-rose-500",   bg: "bg-rose-500/20",   text: "text-rose-400",   solid: "bg-rose-600"   },
    "Cavity":           { border: "border-orange-500", bg: "bg-orange-500/20", text: "text-orange-400", solid: "bg-orange-600" },
    "Impacted Tooth":   { border: "border-amber-500",  bg: "bg-amber-500/20",  text: "text-amber-400",  solid: "bg-amber-600"  },
    "Periapical Lesion":{ border: "border-pink-500",   bg: "bg-pink-500/20",   text: "text-pink-400",   solid: "bg-pink-600"   },
    "Bone Loss":        { border: "border-purple-500", bg: "bg-purple-500/20", text: "text-purple-400", solid: "bg-purple-600" },
    Default:            { border: "border-red-400",    bg: "bg-red-400/20",    text: "text-red-300",    solid: "bg-red-500"    },
};

function getClassColor(className: string) {
    return CLASS_COLORS[className] ?? CLASS_COLORS.Default;
}

/** Pick the best corner for each label so nearby boxes never overlap. */
function computeLabelSlots(detections: Detection[], imgW: number, imgH: number) {
    return detections.map((det, i) => {
        const cx = (det.box.x1 + det.box.x2) / 2;
        const cy = (det.box.y1 + det.box.y2) / 2;

        // Start with sensible defaults based on image-edge proximity
        let vertical: "above" | "below" = cy / imgH < 0.3 ? "below" : "above";
        let horizontal: "left" | "right" = cx / imgW > 0.75 ? "right" : "left";

        // Nudge away from the closest neighbor to avoid overlap
        for (let j = 0; j < detections.length; j++) {
            if (i === j) continue;
            const other = detections[j];
            const ocx = (other.box.x1 + other.box.x2) / 2;
            const ocy = (other.box.y1 + other.box.y2) / 2;

            const dx = Math.abs(cx - ocx);
            const dy = Math.abs(cy - ocy);

            // Vertically stacked neighbors → put label on opposite vertical side
            if (dx < imgW * 0.15 && dy < imgH * 0.25) {
                vertical = cy < ocy ? "above" : "below";
            }

            // Horizontally adjacent neighbors → put label on opposite horizontal side
            if (dy < imgH * 0.12 && dx < imgW * 0.25) {
                horizontal = cx < ocx ? "left" : "right";
            }
        }

        return { vertical, horizontal };
    });
}

/* ── Component ─────────────────────────────────────────────────── */
export default function AIXrayAnalyzer() {
    const { t } = useLanguage();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    /* ── File Handling ──────────────────────────────────────────── */
    const handleFile = useCallback((f: File) => {
        if (!f.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            return;
        }
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setResult(null);
        setError(null);
    }, []);

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
        },
        [handleFile]
    );

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    /* ── API Call ────────────────────────────────────────────────── */
    const analyze = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            const body = new FormData();
            body.append("file", file);

            const res = await fetch("/api/analyze-xray", {
                method: "POST",
                body,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error ?? `Server responded with ${res.status}`);
            }

            const data: AnalysisResponse = await res.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    /* ── Render ──────────────────────────────────────────────────── */
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <Scan size={20} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white">
                            {t?.aiXrayTitle ?? "AI X-Ray Analysis"}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {t?.aiXraySubtitle ?? "Upload a dental X-ray for automated detection"}
                        </p>
                    </div>
                </div>

                {preview && (
                    <button
                        onClick={reset}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        <RotateCcw size={13} />
                        {t?.aiXrayReset ?? "Reset"}
                    </button>
                )}
            </div>

            {/* Upload Zone */}
            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={onDrop}
                            onClick={() => inputRef.current?.click()}
                            className={`
                                relative flex flex-col items-center justify-center gap-3 p-10
                                rounded-2xl border-2 border-dashed cursor-pointer
                                transition-all duration-300
                                ${isDragOver
                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10"
                                }
                            `}
                        >
                            <motion.div
                                animate={isDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="p-4 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                            >
                                <Upload size={28} />
                            </motion.div>

                            <div className="text-center">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {t?.aiXrayDragDrop ?? "Drag & drop your X-ray here"}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    {t?.aiXrayOrClick ?? "or"}{" "}
                                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                        {t?.aiXrayClickBrowse ?? "click"}
                                    </span>{" "}
                                    {t?.aiXrayToBrowse ?? "to browse"}
                                </p>
                            </div>

                            <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-widest font-medium mt-1">
                                {t?.aiXrayFormats ?? "PNG, JPG, WEBP supported"}
                            </p>

                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onInputChange}
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                    >
                        {/* Image Container with Bounding Boxes */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-700">
                            <div className="relative w-full rounded-xl overflow-hidden bg-black">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={preview}
                                    alt="Uploaded X-ray"
                                    className="w-full h-auto block"
                                />

                                {/* Bounding Boxes Overlay */}
                                {result && result.detections.length > 0 && (() => {
                                    const slots = computeLabelSlots(result.detections, result.image_width, result.image_height);

                                    return (
                                        <div className="absolute inset-0">
                                            {result.detections.map((det, i) => {
                                                const leftPct   = (det.box.x1 / result.image_width) * 100;
                                                const topPct    = (det.box.y1 / result.image_height) * 100;
                                                const widthPct  = ((det.box.x2 - det.box.x1) / result.image_width) * 100;
                                                const heightPct = ((det.box.y2 - det.box.y1) / result.image_height) * 100;
                                                const colors    = getClassColor(det.class_name);
                                                const slot      = slots[i];

                                                // Build position classes for the label
                                                const vClass = slot.vertical === "above" ? "bottom-full mb-1" : "top-full mt-1";
                                                const hClass = slot.horizontal === "left" ? "left-0" : "right-0";

                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, scale: 0.85 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.3, delay: i * 0.08 }}
                                                        className={`absolute border-2 ${colors.border} rounded-sm`}
                                                        style={{
                                                            left:   `${leftPct}%`,
                                                            top:    `${topPct}%`,
                                                            width:  `${widthPct}%`,
                                                            height: `${heightPct}%`,
                                                        }}
                                                    >
                                                        {/* Label — positioned at the smartest corner to avoid neighbor overlap */}
                                                        <div
                                                            className={`absolute ${vClass} ${hClass} flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-extrabold whitespace-nowrap text-white shadow-md ${colors.solid}`}
                                                            style={{ zIndex: 10 + i }}
                                                        >
                                                            {det.class_name} · {(det.confidence * 100).toFixed(0)}%
                                                        </div>

                                                        {/* Corner accents */}
                                                        <div className={`absolute -top-px -left-px w-2 h-2 border-t-2 border-l-2 ${colors.border} rounded-tl-sm`} />
                                                        <div className={`absolute -top-px -right-px w-2 h-2 border-t-2 border-r-2 ${colors.border} rounded-tr-sm`} />
                                                        <div className={`absolute -bottom-px -left-px w-2 h-2 border-b-2 border-l-2 ${colors.border} rounded-bl-sm`} />
                                                        <div className={`absolute -bottom-px -right-px w-2 h-2 border-b-2 border-r-2 ${colors.border} rounded-br-sm`} />
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* File info bar */}
                            <div className="flex items-center justify-between mt-3 px-1">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <ImageIcon size={13} />
                                    <span className="font-medium truncate max-w-[200px]">{file?.name}</span>
                                    <span className="text-slate-400 dark:text-slate-600">•</span>
                                    <span>{file ? (file.size / 1024).toFixed(0) : 0} KB</span>
                                </div>
                                <button
                                    onClick={reset}
                                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Analyze Button */}
                        {!result && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={analyze}
                                disabled={loading}
                                className={`
                                    w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl
                                    text-sm font-semibold transition-all duration-300 cursor-pointer
                                    ${loading
                                        ? "bg-indigo-400 dark:bg-indigo-700 text-white/80 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                                    }
                                `}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        {t?.aiXrayAnalyzing ?? "Analyzing X-Ray…"}
                                    </>
                                ) : (
                                    <>
                                        <Scan size={16} />
                                        {t?.aiXrayAnalyzeBtn ?? "Analyze X-Ray"}
                                    </>
                                )}
                            </motion.button>
                        )}

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            >
                                <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                        {t?.aiXrayErrTitle ?? "Analysis Failed"}
                                    </p>
                                    <p className="text-xs text-red-600 dark:text-red-400/80 mt-0.5">{error}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Results Summary */}
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="space-y-4"
                            >
                                {/* Summary Bar */}
                                <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                                    result.detections.length > 0
                                        ? "bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800/60"
                                        : "bg-emerald-50 dark:bg-emerald-900/15 border-emerald-200 dark:border-emerald-800/60"
                                }`}>
                                    {result.detections.length > 0 ? (
                                        <AlertTriangle size={18} className="text-red-500 shrink-0" />
                                    ) : (
                                        <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                                    )}
                                    <div>
                                        <p className={`text-sm font-bold ${
                                            result.detections.length > 0
                                                ? "text-red-700 dark:text-red-400"
                                                : "text-emerald-700 dark:text-emerald-400"
                                        }`}>
                                            {result.detections.length > 0
                                                ? `${result.detections.length} ${t?.aiXrayIssuesDetected ?? "Issues Detected"}`
                                                : (t?.aiXrayNoIssues ?? "No Issues Detected")
                                            }
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            {result.detections.length > 0
                                                ? (t?.aiXrayReviewDesc ?? "Review the highlighted regions above for details.")
                                                : (t?.aiXrayNoIssuesDesc ?? "The X-ray appears clear with no abnormalities detected.")
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Detection Cards */}
                                {result.detections.length > 0 && (
                                    <div className="grid gap-2.5">
                                        {result.detections.map((det, i) => {
                                            const colors = getClassColor(det.class_name);
                                            const confPct = (det.confidence * 100).toFixed(1);

                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.25, delay: i * 0.06 }}
                                                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {/* Matching numbered badge */}
                                                        <div className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-extrabold text-white shrink-0 ${colors.solid}`}>
                                                            {i + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                                                {det.class_name}
                                                            </p>
                                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                                {t?.aiXrayConfidence ?? "Confidence"}: {confPct}%
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Confidence Badge */}
                                                    <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${colors.bg} ${colors.text}`}>
                                                        {confPct}%
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Re-analyze button */}
                                <button
                                    onClick={reset}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                                >
                                    <RotateCcw size={14} />
                                    {t?.aiXrayAnalyzeAnother ?? "Analyze Another X-Ray"}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
