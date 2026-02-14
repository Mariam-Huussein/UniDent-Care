import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectItemsProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

export default function SelectItems({ value, onChange, options }: SelectItemsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSelect = (item: string) => {
        onChange(item);
        setIsOpen(false);
    };

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full sm:w-48 text-sm" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 shadow-sm shadow-gray-100/50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
            >
                <span className="truncate mr-2">{value}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <ul className="py-1 max-h-60 overflow-auto">
                        {options.map((item) => (
                            <li
                                key={item}
                                onClick={() => handleSelect(item)}
                                className={`px-4 py-2.5 cursor-pointer transition-colors ${value === item
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
