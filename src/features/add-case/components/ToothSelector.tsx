import { X } from "lucide-react";

export function ToothBadge({ num }: { num: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-100 dark:border-indigo-800/50">
      {num}
    </span>
  );
}

const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

export default function ToothSelector({ selected, onChange }: { selected: number[]; onChange: (t: number[]) => void }) {
  const toggle = (n: number) =>
    onChange(selected.includes(n) ? selected.filter((t) => t !== n) : [...selected, n]);

  const Row = ({ teeth }: { teeth: number[] }) => (
    <div className="flex gap-1 flex-wrap justify-center">
      {teeth.map((n) => {
        const active = selected.includes(n);
        return (
          <button key={n} type="button" onClick={() => toggle(n)}
            className={`w-8 h-9 rounded-lg text-[10px] font-bold border-2 transition-all duration-150 ${active
              ? "bg-indigo-600 border-indigo-600 text-white shadow-md scale-105"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upper Jaw</p>
        <p className="text-[10px] text-slate-400">{selected.length} selected</p>
      </div>
      <Row teeth={UPPER_TEETH} />
      <div className="h-px bg-slate-100 dark:bg-slate-700/50" />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lower Jaw</p>
      <Row teeth={LOWER_TEETH} />
      {selected.length > 0 && (
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex flex-wrap gap-1.5">{selected.map((t) => <ToothBadge key={t} num={t} />)}</div>
          <button type="button" onClick={() => onChange([])}
            className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium flex items-center gap-1 ml-2 shrink-0">
            <X size={12} /> Clear
          </button>
        </div>
      )}
    </div>
  );
}