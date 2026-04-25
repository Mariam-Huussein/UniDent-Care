import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Loader2 } from "lucide-react";
import { CaseType } from "../../types/caseCardProps.types";
import { getCaseTypes } from "@/server/caseTypes.action";

interface CaseTypeDropdownProps {
    selectedCaseType: string;
    setSelectedCaseType: (value: string) => void;
    onCaseTypeSelect?: (name: string, id: string) => void;
    variant?: "default" | "inline";
    placeholder?: string;
}

export default function CaseTypeDropdown({
    selectedCaseType,
    setSelectedCaseType,
    onCaseTypeSelect,
    variant = "default",
    placeholder = "All Types"
}: CaseTypeDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [caseTypes, setCaseTypes] = useState<CaseType[]>([]);
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch case types on mount
    useEffect(() => {
        const fetchTypes = async () => {
            setIsLoading(true);
            try {
                const response = await getCaseTypes(1, 100);
                if (response.success) {
                    setCaseTypes(response.data.items);
                }
            } catch (error) {
                console.error("Failed to fetch case types", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTypes();
    }, []);

    // Sync input with selected value
    useEffect(() => {
        setSearchInput(selectedCaseType || "");
    }, [selectedCaseType]);

    const filteredTypes = caseTypes.filter(c => {
        if (searchInput === selectedCaseType) return true;

        return c.name.toLowerCase().includes(searchInput.toLowerCase());
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setSearchInput(input);

        if (selectedCaseType && input !== selectedCaseType) {
            setSelectedCaseType("");
        }

        setIsOpen(true);
    };

    const handleSelect = (name: string, id: string = "") => {
        const isAllTypes = name === "All Types";
        setSelectedCaseType(isAllTypes ? "" : name);
        setSearchInput(isAllTypes ? "" : name);
        if (onCaseTypeSelect) {
            onCaseTypeSelect(isAllTypes ? "" : name, isAllTypes ? "" : id);
        }
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCaseType("");
        setSearchInput("");
        inputRef.current?.focus();
        setIsOpen(true);
    };

    const containerClasses = variant === "inline"
        ? "w-full bg-transparent flex items-center justify-between pb-0.5 px-1 transition-all group"
        : `w-full flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all shadow-sm ${isOpen
            ? 'border-blue-400 dark:border-indigo-400 ring-2 ring-blue-500/20 dark:ring-indigo-500/30 bg-white dark:bg-slate-800'
            : 'border-gray-200/80 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700'
        }`;

    return (
        <div className="relative w-full text-sm shrink-0">
            <div
                className={`cursor-text ${containerClasses}`}
                onClick={() => {
                    inputRef.current?.focus();
                    setIsOpen(true);
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={searchInput}
                    onChange={handleSearch}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={`flex-1 bg-transparent w-full outline-none truncate placeholder:text-gray-400 dark:placeholder:text-slate-500 ${variant === 'inline'
                        ? 'text-sm font-medium text-gray-700 dark:text-slate-200'
                        : 'text-sm text-gray-700 dark:text-slate-200'
                        }`}
                />

                <div className="flex items-center gap-1.5 shrink-0">
                    {isLoading && <Loader2 size={14} className="text-blue-500 dark:text-indigo-400 animate-spin" />}

                    {/* Clear Button */}
                    {searchInput && !isLoading && (
                        <button
                            onClick={handleClear}
                            className={`p-0.5 rounded-md transition-colors ${variant === 'inline'
                                ? 'text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200'
                                : 'text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                }`}
                            title="Clear selection"
                        >
                            <X size={14} />
                        </button>
                    )}

                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 cursor-pointer ${isOpen ? "rotate-180" : "rotate-0"
                            } ${variant === 'inline'
                                ? 'text-gray-400 dark:text-slate-400 group-hover:text-gray-600 dark:group-hover:text-slate-200'
                                : 'text-gray-400 dark:text-slate-400'
                            }`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                            if (!isOpen) inputRef.current?.focus();
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
                    <div className={`absolute z-50 mt-1.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${variant === 'default' ? 'w-full max-w-fit min-w-[200px]' : 'w-48'
                        }`}>
                        <ul className="py-1 max-h-60 overflow-auto">
                            <li
                                onClick={() => handleSelect("All Types")}
                                className={`px-4 py-2.5 cursor-pointer transition-colors ${!selectedCaseType
                                    ? "bg-blue-50 dark:bg-indigo-500/20 text-blue-700 dark:text-indigo-300 font-medium"
                                    : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-slate-100"
                                    }`}
                            >
                                All Types
                            </li>

                            {filteredTypes.map((item) => (
                                <li
                                    key={item.publicId}
                                    onClick={() => handleSelect(item.name, item.publicId)}
                                    className={`px-4 py-2.5 cursor-pointer transition-colors ${selectedCaseType === item.name
                                        ? "bg-blue-50 dark:bg-indigo-500/20 text-blue-700 dark:text-indigo-300 font-medium"
                                        : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-slate-100"
                                        }`}
                                >
                                    {item.name}
                                </li>
                            ))}

                            {filteredTypes.length === 0 && (
                                <li className="px-4 py-4 text-center text-sm text-gray-500 dark:text-slate-400">
                                    No types found
                                </li>
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}