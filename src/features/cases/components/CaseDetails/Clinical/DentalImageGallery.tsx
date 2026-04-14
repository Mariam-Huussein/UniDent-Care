"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ImageIcon, Expand } from "lucide-react";

interface DentalImageGalleryProps {
    images: string[];
    compact?: boolean;
}

export default function DentalImageGallery({ images, compact = false }: DentalImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-3">
                    <ImageIcon size={24} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No images uploaded</p>
                <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-0.5">Images will appear here</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {/* Main Image */}
                <div
                    className={`relative w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group ${compact ? "aspect-[4/3]" : "aspect-square lg:aspect-[4/5]"
                        }`}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeIndex}
                            src={images[activeIndex]}
                            alt={`Dental image ${activeIndex + 1}`}
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.25 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Fullscreen + Zoom */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="w-9 h-9 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/50 dark:border-slate-700/50 flex items-center justify-center shadow-lg cursor-pointer hover:bg-white dark:hover:bg-slate-700 hover:scale-105 transition-all text-slate-700 dark:text-slate-300"
                        >
                            <Expand size={14} />
                        </button>
                    </div>

                    {/* Nav arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/40 dark:border-slate-700/40 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-white dark:hover:bg-slate-700 hover:scale-105 text-slate-700 dark:text-slate-300"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/40 dark:border-slate-700/40 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-white dark:hover:bg-slate-700 hover:scale-105 text-slate-700 dark:text-slate-300"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </>
                    )}

                    {/* Counter pill */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                        <ImageIcon size={11} />
                        {activeIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 patient-details-scrollbar">
                        {images.map((src, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveIndex(i)}
                                className={`shrink-0 w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${i === activeIndex
                                        ? "border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 ring-2 ring-indigo-200/50 dark:ring-indigo-900/30"
                                        : "border-slate-200/80 dark:border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-600"
                                    }`}
                            >
                                <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Fullscreen Modal ── */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/85 dark:bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + images.length) % images.length); }}
                                    className="absolute left-4 z-50 w-11 h-11 rounded-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 dark:border-slate-700/50 flex items-center justify-center text-white hover:bg-white/20 dark:hover:bg-slate-700/80 transition-all cursor-pointer"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % images.length); }}
                                    className="absolute right-4 z-50 w-11 h-11 rounded-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 dark:border-slate-700/50 flex items-center justify-center text-white hover:bg-white/20 dark:hover:bg-slate-700/80 transition-all cursor-pointer"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}

                        <motion.img
                            key={activeIndex}
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            src={images[activeIndex]}
                            alt={`Full ${activeIndex + 1}`}
                            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Bottom dots */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-2 rounded-full">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                                    className={`transition-all duration-300 rounded-full cursor-pointer ${i === activeIndex ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/60"
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
