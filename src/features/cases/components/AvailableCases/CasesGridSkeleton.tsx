
export default function CasesGridSkeleton({ pageSize }: { pageSize: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[...Array(pageSize)].map((_, i) => (
                <div key={i} className="flex flex-col rounded-2xl border  overflow-hidden animate-pulse
                 bg-white dark:bg-slate-800
                  border-gray-100 dark:border-slate-700/60">
                    <div className="w-full h-[140px] bg-gray-100 dark:bg-slate-700" />
                    <div className="flex flex-col justify-between p-4 flex-1">
                        <div>
                            <div className="h-5 bg-gray-100 rounded-lg w-3/4 mb-3 dark:bg-slate-700" />
                            <div className="h-3 bg-gray-100 rounded w-1/2 mb-4 dark:bg-slate-700" />
                            <div className="flex gap-2">
                                <div className="h-7 bg-gray-100 rounded-lg w-20 dark:bg-slate-700" />
                                <div className="h-7 bg-gray-100 rounded-lg w-24 dark:bg-slate-700" />
                                <div className="h-7 bg-gray-100 rounded-lg w-16 dark:bg-slate-700" />
                            </div>
                        </div>
                        <div className="flex gap-2.5">
                            <div className="h-10 bg-gray-100 rounded-xl flex-1 dark:bg-slate-700" />
                            <div className="h-10 bg-gray-100 rounded-xl flex-1 dark:bg-slate-700" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
