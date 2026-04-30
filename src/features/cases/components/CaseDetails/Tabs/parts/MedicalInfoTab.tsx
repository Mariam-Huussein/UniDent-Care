import { Activity, Pill } from "lucide-react";

interface MedicalInfoTabProps {
    medicalHistory?: string[];
    medications?: string[];
}

export default function MedicalInfoTab({ medicalHistory, medications }: MedicalInfoTabProps) {
    return (
        <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Activity size={18} />
                    </div>
                    Medical History
                </h3>
                {medicalHistory && medicalHistory.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
                        {medicalHistory.map((item, i) => (
                            <li key={i} className="leading-relaxed">
                                {item}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                        No medical history provided.
                    </p>
                )}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <Pill size={18} />
                    </div>
                    Medications
                </h3>
                {medications && medications.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
                        {medications.map((item, i) => (
                            <li key={i} className="leading-relaxed">
                                {item}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                        No medications provided.
                    </p>
                )}
            </div>
        </div>
    );
}
