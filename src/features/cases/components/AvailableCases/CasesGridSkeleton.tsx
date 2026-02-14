export default function CasesGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="w-full h-[140px] bg-gray-100" />
                    <div className="flex flex-col justify-between p-4 flex-1">
                        <div>
                            <div className="h-5 bg-gray-100 rounded-lg w-3/4 mb-3" />
                            <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                            <div className="flex gap-2">
                                <div className="h-7 bg-gray-100 rounded-lg w-20" />
                                <div className="h-7 bg-gray-100 rounded-lg w-24" />
                                <div className="h-7 bg-gray-100 rounded-lg w-16" />
                            </div>
                        </div>
                        <div className="flex gap-2.5">
                            <div className="h-10 bg-gray-100 rounded-xl flex-1" />
                            <div className="h-10 bg-gray-100 rounded-xl flex-1" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
