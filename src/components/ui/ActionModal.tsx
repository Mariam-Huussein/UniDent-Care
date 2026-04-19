"use client";

import { useEffect } from "react";
import { X, AlertTriangle, Loader2, Info } from "lucide-react";

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAction: () => void;
    title: string;
    message: string;
    actionText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: "primary" | "danger";
}

export default function ActionModal({
    isOpen,
    onClose,
    onAction,
    title,
    message,
    actionText = "Confirm",
    cancelText = "Cancel",
    isLoading = false,
    variant = "danger",
}: ActionModalProps) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const isDanger = variant === "danger";
    const Icon = isDanger ? AlertTriangle : Info;
    const iconBgColor = isDanger ? "bg-red-100 dark:bg-red-500/20" : "bg-blue-100 dark:bg-blue-500/20";
    const iconColor = isDanger ? "text-red-600 dark:text-red-500" : "text-blue-600 dark:text-blue-500";
    const actionButtonClass = isDanger ? "my-btn-danger-outline" : "my-btn";

    return (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={!isLoading ? onClose : undefined}>
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-red-900/10 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-full ${iconBgColor}`}>
                            <Icon size={24} className={iconColor} />
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="my-btn-outline py-2"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onAction}
                        disabled={isLoading}
                        className={`${actionButtonClass} py-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            actionText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}