export default function CustomAvatar({ name, gradient }: { name: string; gradient: string }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return (
        <div
            className={`shrink-0 w-9 h-9 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-slate-900`}
        >
            <span className="text-white font-bold text-[11px]">{initials}</span>
        </div>
    );
}