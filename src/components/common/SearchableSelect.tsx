"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  id: string | number;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder: string;
  searchPlaceholder?: string;
  error?: string;
  isRtl?: boolean;
  accentColor?: "indigo" | "teal" | "blue";
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder = "Search...",
  error,
  isRtl = false,
  accentColor = "indigo",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.id === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const colorConfig = {
    indigo: {
      border: "focus:border-indigo-500 dark:focus:border-indigo-400",
      text: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50/50 dark:bg-indigo-900/20",
      hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
    },
    teal: {
      border: "focus:border-teal-500 dark:focus:border-teal-400",
      text: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50/50 dark:bg-teal-900/20",
      hover: "hover:bg-teal-50 dark:hover:bg-teal-900/30",
    },
    blue: {
      border: "focus:border-blue-600 dark:focus:border-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50/50 dark:bg-blue-900/20",
      hover: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
    },
  }[accentColor];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionId: string | number) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${
          error
            ? "border-red-200 dark:border-red-900/50"
            : `border-slate-50 dark:border-slate-800 ${colorConfig.border}`
        } rounded-2xl ${
          isRtl ? "pr-11 pl-4 text-right" : "pl-11 pr-4 text-left"
        } py-3.5 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 flex items-center justify-between group shadow-sm`}
      >
        <span
          className={`truncate ${
            !selectedOption ? "text-slate-400 dark:text-slate-600" : "font-medium"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          } ${isOpen ? colorConfig.text : "text-slate-400"}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[100] w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
          >
            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search
                  className={`absolute ${
                    isRtl ? "right-3" : "left-3"
                  } top-1/2 -translate-y-1/2 text-slate-400`}
                  size={16}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-sm border-none rounded-xl ${
                    isRtl ? "pr-9 pl-8" : "pl-9 pr-8"
                  } py-2.5 outline-none focus:ring-2 ${
                    accentColor === "indigo"
                      ? "focus:ring-indigo-500/20"
                      : accentColor === "teal"
                      ? "focus:ring-teal-500/20"
                      : "focus:ring-blue-500/20"
                  }`}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`absolute ${
                      isRtl ? "left-3" : "right-3"
                    } top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200`}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <ul className="max-h-60 overflow-auto py-2 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`px-4 py-3 mx-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      value === option.id
                        ? `${colorConfig.bg} ${colorConfig.text} font-bold`
                        : `text-slate-700 dark:text-slate-300 ${colorConfig.hover}`
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {value === option.id && (
                      <motion.div
                        layoutId="active-indicator"
                        className={`w-1.5 h-1.5 rounded-full ${
                          accentColor === "indigo"
                            ? "bg-indigo-500"
                            : accentColor === "teal"
                            ? "bg-teal-500"
                            : "bg-blue-500"
                        }`}
                      />
                    )}
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-center text-slate-400 dark:text-slate-600 italic flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <Search size={20} />
                  </div>
                  <span>No results found</span>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
