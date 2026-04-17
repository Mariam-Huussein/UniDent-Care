"use client";

export function MyCasesSkeleton() {
  return (
    <div className="w-11/12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 space-y-3 animate-pulse">
      <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4" />
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-2.5 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
}
