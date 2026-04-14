export default function InfoCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
    return (
        <div className="flex items-center gap-2.5 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-100/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200/60 dark:hover:border-slate-700 transition-all duration-200 group">
            <div className={`w-7 h-7 rounded-lg bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0 ${color} group-hover:scale-105 transition-transform`}>
                <Icon size={13} />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" suppressHydrationWarning>{value}</p>
            </div>
        </div>
    );
}
