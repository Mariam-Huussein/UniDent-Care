import { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import { DoctorSearchResult } from "@/features/cases/types/caseCardProps.types";

interface DoctorSelectProps {
    value: DoctorSearchResult | null;
    onChange: (doctor: DoctorSearchResult | null) => void;
    onSearch: (query: string) => void;
    options: DoctorSearchResult[];
    loading: boolean;
    placeholder?: string;
}

export default function SelectDoctorByUserName({
    value,
    onChange,
    onSearch,
    options,
    loading,
    placeholder = "Search doctor by username...",
}: DoctorSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value) {
            setSearchInput(value.username);
        }
    }, [value]);

    const handleSearch = (input: string) => {
        setSearchInput(input);
        
        if (value && input !== value.username) {
            onChange(null);
        }
        
        onSearch(input);
        setIsOpen(true);
    };

    const handleSelect = (doctor: DoctorSearchResult) => {
        onChange(doctor);
        setSearchInput(doctor.username);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setSearchInput("");
        onSearch("");
        inputRef.current?.focus();
        setIsOpen(true);
    };

    return (
        <div className="relative w-full">
            {/* Search Input Container */}
            <div 
                className={`w-full flex items-center gap-2 px-3 py-2.5 border rounded-xl bg-white dark:bg-slate-900/50 text-gray-700 dark:text-slate-200 shadow-sm transition-all duration-200 ${
                    isOpen 
                        ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/30' 
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
                onClick={() => {
                    inputRef.current?.focus();
                    setIsOpen(true);
                }}
            >
                <Search size={16} className={`${isOpen ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`} />
                
                <input
                    ref={inputRef}
                    type="text"
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-sm text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none"
                />

                <div className="flex items-center gap-2">
                    {loading && <Loader2 size={14} className="text-blue-500 dark:text-blue-400 animate-spin" />}
                    
                    {(searchInput || value) && !loading && (
                        <button
                            onClick={handleClear}
                            className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            title="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}
                    
                    <ChevronDown 
                        className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200 cursor-pointer ${isOpen ? "rotate-180" : ""}`} 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                        }}
                    />
                </div>
            </div>

            {/* Dropdown Menu & Overlay */}
            {isOpen && (
                <>
                    {/* Transparent Full-Screen Overlay */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Options List Content */}
                    <div className="absolute top-full left-0 z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <ul className="relative z-50 max-h-60 overflow-auto">
                            {loading && searchInput ? (
                                <li className="px-4 py-8 text-center text-sm text-gray-500 dark:text-slate-400">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                        Searching...
                                    </div>
                                </li>
                            ) : options.length > 0 ? (
                                options.map((doctor) => (
                                    <li
                                        key={doctor.publicId}
                                        onClick={() => handleSelect(doctor)}
                                        className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 dark:border-slate-800/50 last:border-b-0 ${
                                            value?.publicId === doctor.publicId 
                                                ? 'bg-blue-50 dark:bg-blue-900/20' 
                                                : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <div className="font-medium text-gray-900 dark:text-slate-200">@{doctor.username}</div>
                                        <div className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{doctor.fullName}</div>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-6 text-center text-sm text-gray-500 dark:text-slate-400">
                                    No doctors found
                                </li>
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}