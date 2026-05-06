import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Loader2, Plus } from "lucide-react";
import { CaseType } from "../../types/caseCardProps.types";
import { getCaseTypes, createCaseType } from "@/server/caseTypes.action";
import { createPortal } from "react-dom";
import { getUserDetailsFromCookies } from "@/utils/sharedHelper";
import toast from "react-hot-toast";

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

    // ── "Add New" state ──────────────────────────────────────────────────────
    const { userRole } = getUserDetailsFromCookies();
    const isClinicalDoctor = userRole === "ClinicalDoctor";
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTypeName, setNewTypeName] = useState("");
    const [newTypeDesc, setNewTypeDesc] = useState("");
    const [isCreating, setIsCreating] = useState(false);

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

    const handleCreate = async () => {
        if (!newTypeName.trim()) return;
        setIsCreating(true);
        try {
            const res = await createCaseType(newTypeName.trim(), newTypeDesc.trim());
            if (res.success && res.data) {
                setCaseTypes((prev) => [...prev, { publicId: res.data!.publicId, name: res.data!.name, description: res.data!.description }]);
                handleSelect(res.data.name, res.data.publicId);
                toast.success(`"${res.data.name}" added successfully`);
                setShowAddForm(false);
                setNewTypeName("");
                setNewTypeDesc("");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to create case type");
        } finally {
            setIsCreating(false);
        }
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
                        <ul className="py-1 overflow-y-auto max-h-60 patient-details-scrollbar">
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
                            {filteredTypes.length === 0 && !showAddForm && (
                                <li className="px-4 py-8 text-center text-slate-400 text-xs">
                                    No results found
                                </li>
                            )}

                            {/* Add New Case Type — ClinicalDoctor only */}
                            {isClinicalDoctor && (
                                <li className="border-t border-slate-100 dark:border-slate-700">
                                    {!showAddForm ? (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setShowAddForm(true); }}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                        >
                                            <Plus size={13} /> Add New Case Type
                                        </button>
                                    ) : (
                                        <div className="p-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                autoFocus
                                                type="text"
                                                value={newTypeName}
                                                onChange={(e) => setNewTypeName(e.target.value)}
                                                placeholder="Type name *"
                                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-400"
                                            />
                                            <input
                                                type="text"
                                                value={newTypeDesc}
                                                onChange={(e) => setNewTypeDesc(e.target.value)}
                                                placeholder="Description (optional)"
                                                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-400"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleCreate}
                                                    disabled={!newTypeName.trim() || isCreating}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                                                >
                                                    {isCreating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                                    {isCreating ? "Adding..." : "Add"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setShowAddForm(false); setNewTypeName(""); setNewTypeDesc(""); }}
                                                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
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