"use client";

import { BookOpen } from "lucide-react";

export function MyCasesEmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-slate-100/50 dark:bg-slate-800/50 flex items-center justify-center mb-5 ring-1 ring-slate-200 dark:ring-slate-700/50">
        <BookOpen size={32} className="text-slate-400 dark:text-slate-500" />
      </div>
      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{message}</p>
      <p className="text-sm text-slate-400 mt-1 max-w-sm">Check back later or track pending items.</p>
    </div>
  );
}
