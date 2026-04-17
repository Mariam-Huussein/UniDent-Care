import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  loading?: boolean;
  progress?: number;
}

export function StatCard({ label, value, icon: Icon, color, bgColor, loading = false, progress }: StatCardProps) {
  const clampedProgress = progress != null ? Math.min(100, Math.max(0, progress)) : null;

  return (
    <div className="relative overflow-hidden group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:shadow-slate-900/50 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          {loading ? (
            <div className="h-8 w-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
          ) : (
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{value}</h3>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={26} strokeWidth={2.5} />
        </div>
      </div>

      {clampedProgress != null && !loading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Progress</span>
            <span className={`text-xs font-bold ${color}`}>{clampedProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${bgColor} transition-all duration-700 ease-out`}
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 h-1.5 w-full opacity-0 group-hover:opacity-100 transition-opacity ${bgColor}`} />
    </div>
  );
}
