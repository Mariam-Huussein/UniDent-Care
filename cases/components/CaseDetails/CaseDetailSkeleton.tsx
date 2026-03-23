export default function CaseDetailSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-200" />
                <div className="space-y-2">
                    <div className="h-6 w-48 rounded-lg bg-gray-200" />
                    <div className="h-4 w-24 rounded-lg bg-gray-100" />
                </div>
            </div>

            {/* White container skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Image skeleton */}
                <div className="h-[280px] sm:h-[360px] lg:h-[420px] bg-gray-200" />

                {/* Info + Actions skeleton */}
                <div className="p-5 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                            <div className="space-y-4">
                                <div className="h-3 w-20 rounded bg-gray-100" />
                                {Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100" />
                                        <div className="space-y-1.5 flex-1">
                                            <div className="h-3 w-16 rounded bg-gray-100" />
                                            <div className="h-4 w-28 rounded bg-gray-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <div className="h-3 w-16 rounded bg-gray-100" />
                                {Array(2).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100" />
                                        <div className="space-y-1.5 flex-1">
                                            <div className="h-3 w-16 rounded bg-gray-100" />
                                            <div className="h-4 w-28 rounded bg-gray-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-10 w-36 rounded-xl bg-gray-200" />
                    </div>
                </div>

                <div className="flex border-b border-gray-100 px-1">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="px-4 py-3">
                            <div className="h-4 w-20 rounded bg-gray-100" />
                        </div>
                    ))}
                </div>
                <div className="p-5 space-y-3">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-100" />
                    <div className="h-3 w-3/4 rounded bg-gray-100" />
                    <div className="h-3 w-5/6 rounded bg-gray-100" />
                </div>
            </div>
        </div>
    );
}
