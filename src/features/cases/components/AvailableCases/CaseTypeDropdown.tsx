import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Loader2 } from "lucide-react";
import { CaseType } from "../../types/caseCardProps.types";
import { getCaseTypes } from "@/server/caseTypes.action";
import { createPortal } from "react-dom";

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
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom,
                left: rect.left,
                width: rect.width
            });
        }
    }, [isOpen]);

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
        <div className="relative w-full text-sm shrink-0" ref={containerRef}>
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
            {/* Dropdown Menu & Overlay */}
            {isOpen && typeof document !== "undefined" && createPortal(
                <div style={{ position: 'relative', zIndex: 99999 }}>
                    {/* الـ Overlay الشفاف لمنع التفاعل مع الخلفية وإغلاق القائمة */}
                    <div
                        className="fixed inset-0"
                        style={{ zIndex: 100000, backgroundColor: 'transparent' }}
                        onClick={() => setIsOpen(false)}
                    />

                    {/* القائمة المنسدلة */}
                    <div
                        className="fixed bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                        style={{
                            zIndex: 100001, // رقم عالي جداً لضمان الظهور فوق الـ Modal
                            top: coords.top,
                            left: coords.left,
                            width: coords.width,
                            maxHeight: '250px',
                            pointerEvents: 'auto' // لضمان إمكانية الضغط على العناصر
                        }}
                    >
                        <ul className="py-1 overflow-y-auto max-h-[240px] patient-details-scrollbar">
                            <li
                                onClick={() => handleSelect("All Types")}
                                className="px-4 py-2.5 cursor-pointer text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border-b border-slate-50 dark:border-slate-700"
                            >
                                Clear Selection
                            </li>
                            {filteredTypes.map((item) => (
                                <li
                                    key={item.publicId}
                                    onClick={() => handleSelect(item.name, item.publicId)}
                                    className={`px-4 py-2.5 cursor-pointer text-xs transition-colors ${selectedCaseType === item.name
                                        ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {item.name}
                                </li>
                            ))}
                            {filteredTypes.length === 0 && (
                                <li className="px-4 py-8 text-center text-slate-400 text-xs">
                                    No results found
                                </li>
                            )}
                        </ul>
                    </div>
                </div>,
                document.body
            )
            }
        </div>
)}