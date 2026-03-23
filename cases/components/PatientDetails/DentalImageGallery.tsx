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
            <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
                    <ImageIcon size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-400">No images uploaded</p>
                <p className="text-[11px] text-gray-300 mt-0.5">Images will appear here</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {/* Main Image */}
                <div
                    className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 border border-gray-100/80 group ${compact ? "aspect-[4/3]" : "aspect-square lg:aspect-[4/5]"
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
                            className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg cursor-pointer hover:bg-white hover:scale-105 transition-all"
                        >
                            <Expand size={14} className="text-gray-700" />
                        </button>
                    </div>

                    {/* Nav arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-white hover:scale-105"
                            >
                                <ChevronLeft size={14} className="text-gray-700" />
                            </button>
                            <button
                                onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-white hover:scale-105"
                            >
                                <ChevronRight size={14} className="text-gray-700" />
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
                                        ? "border-blue-500 shadow-lg shadow-blue-100 ring-2 ring-blue-200/50"
                                        : "border-gray-200/80 opacity-60 hover:opacity-100 hover:border-gray-300"
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
                        className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + images.length) % images.length); }}
                                    className="absolute left-4 z-50 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % images.length); }}
                                    className="absolute right-4 z-50 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
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
