"use client";

import { X, Send, Loader2, User } from "lucide-react";
import { PiTooth } from "react-icons/pi";
import { useSendRequest } from "../../hooks/useSendRequest";

interface SendRequestModalProps {
    caseId: string;
    patientName: string;
    caseType?: string;
    onClose: () => void;
}

export default function SendRequestModal({ caseId, patientName, caseType, onClose }: SendRequestModalProps) {
    const { register, handleSubmit, errors, isValid, loading } = useSendRequest(caseId, onClose);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Send Request</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Fill in the details to send a case request</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Case Info */}
                <div className="px-6 pt-4 pb-2 flex items-center gap-3">
                    <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3 w-full">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <User size={15} className="text-blue-400" />
                            <span className="font-medium">{patientName}</span>
                        </div>
                        {caseType && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <PiTooth size={15} className="text-indigo-400" />
                                <span className="font-medium">{caseType}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {/* Doctor ID */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Doctor ID <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("doctorPublicId")}
                            placeholder="Enter doctor's public ID"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-300 
                                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                        />
                        {errors.doctorPublicId && (
                            <p className="text-xs text-red-500">{errors.doctorPublicId.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            {...register("description")}
                            placeholder="Describe your request (min 10 characters)"
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-300 
                                       resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="my-btn-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            className={`my-btn ${(!isValid || loading) ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={15} />
                                    Send Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
