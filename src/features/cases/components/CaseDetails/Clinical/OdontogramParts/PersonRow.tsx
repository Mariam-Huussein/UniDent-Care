
export default function PersonRow({
    icon,
    role,
    name,
    prefix = "",
    emptyLabel,
}: {
    icon: React.ReactNode;
    role: string;
    name?: string | null;
    prefix?: string;
    emptyLabel: string;
}) {
    return (
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-xl px-3.5 py-3">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {role}
                </p>
                <p
                    className={`text-sm font-semibold truncate mt-0.5 ${
                        name
                            ? "text-slate-800 dark:text-slate-100"
                            : "text-slate-400 dark:text-slate-500 italic font-normal"
                    }`}
                >
                    {name ? `${prefix} ${name}`.trim() : emptyLabel}
                </p>
            </div>
        </div>
    );
}