interface EmptyStateProps {
    search: string;
    onClear: () => void;
}

export default function EmptyState({ search, onClear }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">No cases found</h3>
            <p className="text-sm text-gray-400 max-w-xs">
                {search
                    ? "Try adjusting your search"
                    : "There are no available cases at the moment. Check back later!"}
            </p>
            {search && (
                <button
                    onClick={onClear}
                    className="mt-4 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors cursor-pointer"
                >
                    Clear search
                </button>
            )}
        </div>
    );
}
