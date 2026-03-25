"use client";

export default function CaseDetailsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Hero skeleton */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-sm p-5 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                    {/* Image skeleton */}
                    <div className="space-y-3">
                        <div className="aspect-square lg:aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50" />
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-[68px] h-[68px] rounded-xl bg-gray-100" />
                            ))}
                        </div>
                    </div>

                    {/* Info skeleton */}
                    <div className="space-y-5">
                        <div className="flex justify-between">
                            <div className="h-7 w-24 rounded-full bg-gray-100" />
                            <div className="h-7 w-16 rounded-lg bg-gray-100" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200" />
                            <div className="space-y-2 flex-1">
                                <div className="h-6 w-48 rounded-lg bg-gray-100" />
                                <div className="h-4 w-28 rounded bg-gray-50" />
                            </div>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="space-y-2">
                            <div className="h-4 w-full rounded bg-gray-50" />
                            <div className="h-4 w-4/5 rounded bg-gray-50" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-16 rounded-xl bg-gray-50 border border-gray-100/50" />
                            ))}
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="h-12 rounded-xl bg-gray-100" />
                    </div>
                </div>
            </div>

            {/* Tabs skeleton */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100/80 px-1 py-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-10 w-24 rounded-lg bg-gray-50 mx-2" />
                    ))}
                </div>
                <div className="p-6 space-y-4">
                    <div className="h-5 w-40 rounded bg-gray-100" />
                    <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-gray-50" />
                        <div className="h-4 w-3/4 rounded bg-gray-50" />
                        <div className="h-4 w-1/2 rounded bg-gray-50" />
                    </div>
                </div>
            </div>
        </div>
    );
}
