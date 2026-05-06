import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Step } from "../types/AddCase.types";

export default function StepBar({ step }: { step: Step }) {
  const steps = [
    { key: "lookup", label: "Search Patient" },
    { key: "patient-form", label: "Add Patient" },
    { key: "patient-found", label: "Patient Found" },
    { key: "add-case", label: "Add Case" },
  ];

  // Map step to visual progress index
  const progressMap: Record<Step, number> = {
    lookup: 0,
    "patient-form": 1,
    "patient-found": 1,
    "add-case": 2,
  };
  const current = progressMap[step];

  const displaySteps = [
    { label: "Search", index: 0 },
    { label: step === "patient-form" ? "New Patient" : "Found", index: 1 },
    { label: "Add Case", index: 2 },
  ];

  return (
    <div className="flex items-center gap-0 mb-8">
      {displaySteps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done ? "bg-indigo-600 border-indigo-600 text-white" : active ? "bg-white dark:bg-slate-900 border-indigo-500 text-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-900/20" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"}`}>
                {done ? <CheckCircle2 size={14} /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap ${active ? "text-indigo-600 dark:text-indigo-400" : done ? "text-slate-600 dark:text-slate-300" : "text-slate-400"}`}>
                {s.label}
              </span>
            </div>
            {i < displaySteps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-4 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <motion.div
                  className="h-full bg-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}