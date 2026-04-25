"use client";

import { motion } from "framer-motion";
import { Activity, Stethoscope, FileText, MessageSquare } from "lucide-react";
import { TimelineEvent } from "../../../types/CaseDetails.types";
import { formatTimestamp } from "../../../utils/CaseDetails.utils";

interface ActivityTimelineProps {
    events: TimelineEvent[];
}

function getEventConfig(type: TimelineEvent["type"]) {
    switch (type) {
        case "diagnosis":
            return { icon: Stethoscope, gradient: "from-violet-500 to-purple-600", glow: "shadow-violet-200" };
        case "treatment":
            return { icon: Activity, gradient: "from-blue-500 to-indigo-600", glow: "shadow-blue-200" };
        case "note":
            return { icon: MessageSquare, gradient: "from-amber-400 to-orange-500", glow: "shadow-amber-200 dark:shadow-amber-900/30" };
        default:
            return { icon: FileText, gradient: "from-slate-400 to-slate-500", glow: "shadow-slate-200 dark:shadow-slate-800" };
    }
}

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
    const sorted = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Activity Timeline</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{events.length} events recorded</p>
            </div>

            <div className="relative max-h-[400px] overflow-y-auto patient-details-scrollbar pr-1">
                {/* Glowing vertical line */}
                <div className="absolute left-[14px] top-4 bottom-4 w-px bg-indigo-200 dark:bg-indigo-900/50" />

                <div className="space-y-0.5">
                    {sorted.map((event, i) => {
                        const cfg = getEventConfig(event.type);
                        const { date, time } = formatTimestamp(event.timestamp);
                        const Icon = cfg.icon;

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06, duration: 0.35 }}
                                className="relative flex items-start gap-3.5 py-3 group"
                            >
                                {/* Node */}
                                <div className={`relative z-10 shrink-0 w-7 h-7 rounded-lg bg-linear-to-br ${cfg.gradient} flex items-center justify-center shadow-md ${cfg.glow} group-hover:scale-110 transition-transform duration-200`}>
                                    <Icon size={13} className="text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-snug font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {event.description}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                                        {date} · {time}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
