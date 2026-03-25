import { SearchX, Inbox } from "lucide-react";

interface EmptyStateProps {
    search: string;
    onClear: () => void;
}

export default function EmptyState({ search, onClear }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 shadow-lg text-white ${
                search ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-indigo-400 shadow-indigo-400/20'
            }`}>
                {search ? (
                    <SearchX size={32} strokeWidth={2.5} />
                ) : (
                    <Inbox size={32} strokeWidth={2.5} />
                )}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                {search ? "No Cases Found" : "No Available Cases"}
            </h3>
            
            <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto mb-8">
                {search 
                    ? "We couldn't find any cases matching your search. Try adjusting your filters." 
                    : "There are currently no active patient cases in the system. Check back later."}
            </p>

            {search && (
                <button
                    onClick={onClear}
                    className="my-btn-outline px-6 py-2.5"
                >
                    Clear Search
                </button>
            )}
        </div>
    );
}
