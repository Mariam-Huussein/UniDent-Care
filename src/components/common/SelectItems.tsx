import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface SelectItemsProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    variant?: "default" | "inline";
}

export default function SelectItems({ value, onChange, options, placeholder = "Select an option...", variant = "default" }: SelectItemsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const containerClasses = variant === "inline"
        ? "w-full bg-transparent flex items-center justify-between pb-0.5 px-1 transition-all group"
        : `w-full flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all shadow-sm ${
            isOpen 
                ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/30 bg-white dark:bg-slate-900/50' 
                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-gray-300 dark:hover:border-slate-600'
          }`;

    useEffect(() => {
        setSearchInput(value || "");
    }, [value]);

    const filteredOptions = options.filter(option => {
        if (searchInput === value) return true;
        return option.toLowerCase().includes(searchInput.toLowerCase());
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setSearchInput(input);
        
        if (value && input !== value) {
            onChange("");
        }
        
        setIsOpen(true);
    };

    const handleSelect = (item: string) => {
        onChange(item);
        setSearchInput(item);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setSearchInput("");
        inputRef.current?.focus();
        setIsOpen(true);
    };

    return (
        <div className="relative w-full text-sm">
            <div 
                className={`cursor-text ${containerClasses}`}
                onClick={() => {
                    inputRef.current?.focus();
                    inputRef.current?.select(); 
                    setIsOpen(true);
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={searchInput}
                    onChange={handleSearch}
                    onFocus={(e) => {
                        setIsOpen(true);
                        e.target.select();
                    }}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent w-full text-sm text-gray-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none truncate"
                />

                <div className="flex items-center gap-1.5 shrink-0">
                    {searchInput && (
                        <button
                            onClick={handleClear}
                            className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                            title="Clear selection"
                        >
                            <X size={14} />
                        </button>
                    )}
                    
                    <ChevronDown 
                        className={`w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200 cursor-pointer ${isOpen ? "rotate-180" : "rotate-0"}`} 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                            if (!isOpen) {
                                inputRef.current?.focus();
                                inputRef.current?.select();
                            }
                        }}
                    />
                </div>
            </div>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)} 
                    />

                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <ul className="py-1 max-h-60 overflow-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((item) => (
                                    <li
                                        key={item}
                                        onClick={() => handleSelect(item)}
                                        className={`px-4 py-2.5 cursor-pointer transition-colors ${
                                            value === item
                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                                                : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-100"
                                        }`}
                                    >
                                        {item}
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-4 text-center text-sm text-gray-500 dark:text-slate-400">
                                    No options found
                                </li>
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}