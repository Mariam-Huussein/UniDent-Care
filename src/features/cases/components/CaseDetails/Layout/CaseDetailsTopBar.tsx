"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CaseStatus } from "../../../types/CaseDetails.types";
import { getPatientStatusConfig } from "../../../utils/CaseDetails.utils";
import { useCase } from "@/features/cases/context/CaseContext";
import { useLanguage } from "@/components/providers/LanguageProvider";
import toast from "react-hot-toast";

interface CaseDetailsTopBarProps {
    currentStatus: CaseStatus;
    patientName: string;
}

export default function CaseDetailsTopBar({ currentStatus, patientName }: CaseDetailsTopBarProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const { caseData, caseId } = useCase();
    const cfg = getPatientStatusConfig(currentStatus, t);

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/cases/${caseId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Case: ${caseData?.patientName}`,
                    text: `Check out this dental case for ${caseData?.patientName}`,
                    url: shareUrl,
                });
                return;
            } catch (err) {
                console.error("Error sharing:", err);
                if ((err as Error).name === 'AbortError') return;
            }
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(shareUrl);
                toast.success(t.caseDetailsLinkCopied);
                return;
            } catch (err) {
                console.error("Failed to copy using clipboard API:", err);
            }
        }

        try {
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            toast.success(t.caseDetailsLinkCopiedShort);
        } catch (err) {
            console.error("Fallback copy failed:", err);
            toast.error(t.caseDetailsCopyFailed);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div className="flex items-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:shadow-md transition-all cursor-pointer"
                    aria-label={t.caseDetailsGoBack}
                >
                    <ArrowLeft size={17} />
                </motion.button>
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                        {patientName}&apos;s {t.caseDetailsTitle}
                    </h1>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.caseDetailsSubtitle}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {/* Share Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="flex cursor-pointer items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors uppercase tracking-wide"
                >
                    <Share2 size={14} className="text-blue-500" />
                    {t.caseDetailsShare}
                </motion.button>

                {/* Status Badge */}
                <span className={`inline-flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-xl ${cfg.bg} ${cfg.text} tracking-wide uppercase shadow-sm border ${cfg.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                    {cfg.label}
                </span>
            </div>
        </motion.div>
    );
}
