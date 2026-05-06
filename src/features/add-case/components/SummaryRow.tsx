
export default function SummaryRow({ icon, label, value, truncate }: { icon: React.ReactNode; label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-14 shrink-0 mt-0.5">{label}</p>
      <p className={`text-xs font-semibold text-slate-700 dark:text-slate-200 flex-1 ${truncate ? "truncate" : "leading-relaxed"}`}>{value}</p>
    </div>
  );
}