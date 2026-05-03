import { customeInitials } from "../../../services/sessionHelper";

export default function TimelineRail({ name, isLast }: { name: string; isLast: boolean }) {
    return (
    <div className="flex flex-col items-center">
        <div className="relative z-10 w-11 h-11 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md ring-[3px] ring-white dark:ring-slate-950 text-white font-bold text-xs shrink-0">
            {customeInitials(name)}
        </div>
        {!isLast && (
            <div className="w-px flex-1 min-h-[32px] mt-2 bg-linear-to-b from-indigo-200 dark:from-indigo-800/50 to-transparent" />
        )}
    </div>
    )
};