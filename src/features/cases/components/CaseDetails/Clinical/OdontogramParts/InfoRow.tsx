
export default function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
                {icon}
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {label}
                </span>
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 text-right truncate">
                {value}
            </span>
        </div>
    );
}
