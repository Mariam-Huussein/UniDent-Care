export function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="absolute top-0 left-0 w-full h-32 bg-slate-200 dark:bg-slate-800" />
        <div className="px-8 pb-8 pt-20 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700 shadow-xl shrink-0" />
          <div className="flex-1 flex flex-col items-center md:items-start gap-4">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg" />
              <div className="h-8 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800" />
        ))}
      </div>
    </div>
  );
}
