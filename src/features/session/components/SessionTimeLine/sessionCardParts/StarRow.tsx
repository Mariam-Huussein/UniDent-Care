import { Star } from "lucide-react";

export default function StarRow({ grade, max = 20 }: { grade: number; max?: number }) {
    const filled = Math.round((grade / max) * 5);
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    size={11}
                    className={
                        i < filled
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700"
                    }
                />
            ))}
        </div>
    );
}