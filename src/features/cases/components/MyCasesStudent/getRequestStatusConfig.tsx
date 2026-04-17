export function getRequestStatusConfig(status: string) {
  const s = status?.toLowerCase();
  if (s === "approved")
    return { label: "Approved", dot: "bg-emerald-400", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" };
  if (s === "rejected")
    return { label: "Rejected", dot: "bg-red-400", text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" };
  return { label: "Pending", dot: "bg-amber-400", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" };
}