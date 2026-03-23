export default function InfoCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
    return (
        <div className="flex items-center gap-2.5 bg-gray-50/70 rounded-xl px-3 py-2.5 border border-gray-100/50 hover:bg-gray-50 hover:border-gray-200/60 transition-all duration-200 group">
            <div className={`w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 ${color} group-hover:scale-105 transition-transform`}>
                <Icon size={13} />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-gray-800 truncate" suppressHydrationWarning>{value}</p>
            </div>
        </div>
    );
}
