"use client";

import { X, Send, Loader2, User } from "lucide-react";
import { PiTooth } from "react-icons/pi";
import { useSendRequest } from "@/features/cases/hooks/useSendRequest";
import DoctorSelect from "@/features/cases/components/Request/DoctorSelect";
import { useSearchDoctor } from "@/features/cases/hooks/useSearchDoctor";
import { useEffect, useState } from "react";
import { DoctorSearchResult } from "@/features/cases/types/caseCardProps.types";

interface SendRequestModalProps {
    caseId: string;
    patientName: string;
    caseType?: string;
    onClose: () => void;
}

export default function SendRequestModal({ caseId, patientName, caseType, onClose }: SendRequestModalProps) {
    const { register, handleSubmit, errors, isValid, loading, setValue } = useSendRequest(caseId, onClose);
    const { results: doctors, loading: isLoadingDoctors, search: handleSearchDoctors } = useSearchDoctor();
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorSearchResult | null>(null);

    const handleDoctorChange = (doctor: DoctorSearchResult | null) => {
        setSelectedDoctor(doctor);
        if (doctor) {
            setValue("doctorUsername", doctor.username);
        } else {
            setValue("doctorUsername", "");
        }
    };

    useEffect(() => {
        handleSearchDoctors();
    }, [handleSearchDoctors]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-blue-900/10 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100">Send Request</h2>
                        <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5">Fill in the details to send a case request</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Case Info */}
                <div className="px-6 pt-4 pb-2 flex items-center gap-3">
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 w-full border border-transparent dark:border-slate-700/50">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-300">
                            <User size={15} className="text-blue-400 dark:text-blue-500" />
                            <span className="font-medium">{patientName}</span>
                        </div>
                        {caseType && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-300">
                                <PiTooth size={15} className="text-indigo-400 dark:text-indigo-500" />
                                <span className="font-medium">{caseType}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    {/* Doctor Selection */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                            Doctor <span className="text-red-400 dark:text-red-500">*</span>
                        </label>
                        <DoctorSelect
                            value={selectedDoctor}
                            onChange={handleDoctorChange}
                            onSearch={handleSearchDoctors}
                            options={doctors}
                            loading={isLoadingDoctors}
                            placeholder="Search doctor by username..."
                        />
                        <input type="hidden" {...register("doctorUsername")} />
                        {errors.doctorUsername && (
                            <p className="text-xs text-red-500 dark:text-red-400">{errors.doctorUsername.message}</p>
                        )}
                        {!selectedDoctor && <p className="text-xs text-gray-400 dark:text-slate-500">Please select a doctor</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                            Description <span className="text-red-400 dark:text-red-500">*</span>
                        </label>
                        <textarea
                            {...register("description")}
                            placeholder="Describe your request (min 10 characters)"
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-slate-100 placeholder:text-gray-300 dark:placeholder:text-slate-500 
                                       bg-white dark:bg-slate-900/50
                                       resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40 focus:border-blue-400 dark:focus:border-blue-500 transition-all"
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500 dark:text-red-400">{errors.description.message}</p>
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
                            disabled={!isValid || !selectedDoctor || loading}
                            className={`my-btn ${(!isValid || !selectedDoctor || loading) ? "opacity-50 cursor-not-allowed" : ""}`}
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