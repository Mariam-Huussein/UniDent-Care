export function formatElapsed(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const parts: string[] = [];
    if (h > 0) parts.push(`${h}h`);
    parts.push(`${String(m).padStart(2, "0")}m`);
    parts.push(`${String(s).padStart(2, "0")}s`);
    return parts.join(" ");
}

export function customeInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
export function customeFormatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
}
export function customeFormatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: true,
    });
}