export const InfoRow = ({ icon: Icon, label, value, iconColor = "text-blue-500" }: {
    icon: React.ElementType;
    label: string;
    value: string | number | null;
    iconColor?: string;
}) => (
    <div className="flex items-center gap-3 py-2.5">
        <div className={`shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center ${iconColor}`}>
            <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
        </div>
    </div>
);
