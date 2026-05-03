import { AlertCircle } from "lucide-react";

const colorMap = {
  indigo: {
    icon: "bg-indigo-50 text-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-400",
    label: "text-indigo-400 dark:text-indigo-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-400",
    label: "text-emerald-500 dark:text-emerald-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-500 dark:bg-amber-950/60 dark:text-amber-400",
    label: "text-amber-500 dark:text-amber-500",
  },
};

interface SessionInfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color: "indigo" | "emerald" | "amber";
  isWarning?: boolean;
}

export default function SessionInfoTile({ icon, label, value, color, isWarning }: SessionInfoTileProps) {
  const scheme = colorMap[color];

  return (
    <div className="flex items-start gap-4">
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
          ${isWarning
            ? "bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400"
            : scheme.icon
          }`}
      >
        {isWarning ? <AlertCircle size={18} /> : <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span>}
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <p
          className={`text-[10px] font-semibold uppercase tracking-widest
            ${isWarning ? "text-red-400 dark:text-red-500" : scheme.label}`}
        >
          {label}
        </p>
        <p
          className={`text-sm font-medium leading-snug
            ${isWarning
              ? "text-red-600 dark:text-red-400"
              : "text-slate-800 dark:text-slate-100"
            }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}