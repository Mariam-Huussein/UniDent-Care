import { motion } from "framer-motion";
import { CalendarPlus, Loader2, Activity } from "lucide-react";

interface Props {
    showForm: boolean;
    sessionDate: string;
    sessionLocation: string;
    sessionLoading: boolean;
    onToggleForm: (val: boolean) => void;
    onDateChange: (val: string) => void;
    onLocationChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function ScheduleSessionSection({
    showForm, sessionDate, sessionLocation, sessionLoading,
    onToggleForm, onDateChange, onLocationChange, onSubmit,
}: Props) {
    return (
        <div className="space-y-3">
            {!showForm ? (
                <button onClick={() => onToggleForm(true)} className="my-btn w-full py-3 group">
                    <CalendarPlus size={15} className="group-hover:scale-110 transition-transform" />
                    Schedule New Session
                </button>
            ) : (
                <motion.form
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={onSubmit}
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 space-y-3"
                >
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <CalendarPlus size={14} className="text-blue-500" />
                        New Session
                    </h4>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            Date & Time <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={sessionDate}
                            onChange={(e) => onDateChange(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            Location
                        </label>
                        <input
                            type="text"
                            value={sessionLocation}
                            onChange={(e) => onLocationChange(e.target.value)}
                            placeholder="e.g. Clinic A - Room 3"
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => onToggleForm(false)}
                            className="my-btn-outline flex-1 py-2 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={sessionLoading || !sessionDate}
                            className={`my-btn flex-1 py-2 text-sm ${(sessionLoading || !sessionDate) ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {sessionLoading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Activity size={14} />
                                    Create Session
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
            )}
        </div>
    );
}