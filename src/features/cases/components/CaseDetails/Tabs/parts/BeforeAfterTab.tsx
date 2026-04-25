interface BeforeAfterTabProps {
    beforeImageUrls?: string[];
    afterImageUrls?: string[];
    defaultImageUrls: string[];
}

export default function BeforeAfterTab({ beforeImageUrls, afterImageUrls, defaultImageUrls }: BeforeAfterTabProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">Before & After</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Before</span>
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                        <img src={beforeImageUrls?.[0] || defaultImageUrls[0]} alt="Before" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-sm shadow-sm">Before</div>
                    </div>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">After</span>
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800 shadow-sm">
                        <img src={afterImageUrls?.[0] || defaultImageUrls[0]} alt="After" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-sm shadow-sm">After</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
