import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { getCaseTypes } from "../../server/case.action";
import { CaseType } from "../../types/caseCardProps.types";

interface CaseTypeDropdownProps {
    selectedCaseType: string;
    setSelectedCaseType: (value: string) => void;
    variant?: "default" | "inline";
    placeholder?: string;
}

export default function CaseTypeDropdown({
    selectedCaseType,
    setSelectedCaseType,
    variant = "default",
    placeholder = "All Types"
}: CaseTypeDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [caseTypes, setCaseTypes] = useState<CaseType[]>([]);
    const [typeSearch, setTypeSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await getCaseTypes(1, 100);
                if (response.success) {
                    setCaseTypes(response.data.items);
                }
            } catch (error) {
                console.error("Failed to fetch case types", error);
            }
        };
        fetchTypes();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredTypes = caseTypes.filter(c => c.name.toLowerCase().includes(typeSearch.toLowerCase()));
    const selectedName = caseTypes.find(c => c.name === selectedCaseType)?.name || placeholder;

    const handleSelect = (name: string) => {
        setSelectedCaseType(name === "All Types" ? "" : name);
        setIsOpen(false);
        setTypeSearch("");
    };

    return (
        <div className="relative w-full text-sm shrink-0" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={
                    variant === "inline"
                        ? "w-full bg-transparent text-sm text-left flex items-center justify-between text-gray-700 font-medium pb-0.5 px-1 focus:outline-none transition-all group"
                        : "w-full h-9 flex items-center justify-between px-3 border border-gray-200/80 rounded-lg bg-gray-50/50 text-gray-700 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-normal shadow-sm"
                }
            >
                <span className={`truncate mr-2 ${!selectedCaseType && variant === 'inline' ? 'text-gray-700' : ''}`}>
                    {selectedCaseType ? selectedName : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"} ${variant === 'inline' ? 'text-gray-400 group-hover:text-gray-600' : 'text-gray-400'}`} />
            </button>

            {isOpen && (
                <div className={`absolute z-50 w-1.8 max-w-lg min-w-40 mt-1.5 md:w-full md:max-w-fit bg-white border border-gray-100 rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${variant === 'default' ? 'w-full max-w-fit' : ''}`} >
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search types..."
                                value={typeSearch}
                                onChange={(e) => setTypeSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                            />
                        </div>
                    </div>
                    <ul className="py-1 max-h-60 overflow-auto">
                        <li
                            onClick={() => handleSelect("All Types")}
                            className={`px-4 py-2.5 cursor-pointer transition-colors ${!selectedCaseType ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            All Types
                        </li>
                        {filteredTypes.map((item) => (
                            <li
                                key={item.publicId}
                                onClick={() => handleSelect(item.name)}
                                className={`px-4 py-2.5 cursor-pointer transition-colors ${selectedCaseType === item.name
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {item.name}
                            </li>
                        ))}
                        {filteredTypes.length === 0 && (
                            <li className="px-4 py-3 text-gray-500 text-center text-sm">
                                No types found
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
