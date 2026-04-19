export function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
}

export function getStatusConfig(status: string) {
    const s = status?.toLowerCase();
    if (s === "pending") return { label: "Pending", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" };
    if (s === "approved") return { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" };
    if (s === "completed") return { label: "Completed", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" };
    return { label: "Available", bg: "bg-violet-50", text: "text-violet-600", dot: "bg-violet-400" };
}
