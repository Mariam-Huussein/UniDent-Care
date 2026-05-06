
export default function FormSection({
  icon: Icon, title, subtitle, children, iconColor = "from-indigo-500 to-violet-600",
}: {
  icon: React.ElementType; title: string; subtitle?: string; children: React.ReactNode; iconColor?: string;
}) {
  return (
    <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-slate-800 shadow-xl shadow-slate-100/60 dark:shadow-none p-6 sm:p-7 space-y-5 overflow-hidden">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 rounded-full bg-indigo-50 dark:bg-indigo-900/10 blur-3xl opacity-60 pointer-events-none" />
      <div className="relative flex items-center gap-3.5">
        <div className={`w-10 h-10 rounded-2xl bg-linear-to-br ${iconColor} flex items-center justify-center shadow-md text-white shrink-0`}>
          <Icon size={18} strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}