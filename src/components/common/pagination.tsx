import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, hasPreviousPage, hasNextPage, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between w-full max-w-80 text-gray-500 font-medium mx-auto my-5">
            <button
                type="button"
                aria-label="Previous page"
                disabled={!hasPreviousPage}
                onClick={() => onPageChange(currentPage - 1)}
                className= {`${!hasPreviousPage &&`hidden`} h-10 w-10 flex items-center justify-center rounded-full bg-slate-200/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors`}
            >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) =>
                    typeof page === "string" ? (
                        <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none">
                            ···
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`h-10 w-10 rounded-full ${currentPage === page ? "my-btn text-white" : "my-btn-outline"}`}
                        >
                            {page}
                        </button>
                ))}
            </div>

            <button
                type="button"
                aria-label="Next page"
                disabled={!hasNextPage}
                onClick={() => onPageChange(currentPage + 1)}
                className= {`${!hasNextPage &&`hidden`} h-10 w-10 flex items-center justify-center rounded-full bg-slate-200/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors`}
            >
                <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
        </div>
    )
}