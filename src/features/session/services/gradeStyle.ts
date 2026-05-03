export function gradeStyle(grade: number) {
    const pct = (grade / 20) * 100;
    if (pct >= 85)
        return {
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            border: "border-emerald-200 dark:border-emerald-700/40",
            bar: "from-emerald-400 to-teal-500",
            ring: "ring-emerald-400/30",
            label: "Excellent",
        };
    if (pct >= 70)
        return {
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            border: "border-blue-200 dark:border-blue-700/40",
            bar: "from-blue-400 to-indigo-500",
            ring: "ring-blue-400/30",
            label: "Good",
        };
    if (pct >= 50)
        return {
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            border: "border-amber-200 dark:border-amber-700/40",
            bar: "from-amber-400 to-orange-500",
            ring: "ring-amber-400/30",
            label: "Satisfactory",
        };
    return {
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-700/40",
        bar: "from-red-400 to-rose-500",
        ring: "ring-red-400/30",
        label: "Needs Work",
    };
}
