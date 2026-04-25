import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon, Expand } from "lucide-react";

interface MainImageViewProps {
    images: string[];
    activeIndex: number;
    compact: boolean;
    onIndexChange: (index: number) => void;
    onFullscreenOpen: () => void;
}

export default function MainImageView({ images, activeIndex, compact, onIndexChange, onFullscreenOpen }: MainImageViewProps) {
    return (
        <div
            className={`relative w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group ${compact ? "aspect-4/3" : "aspect-square lg:aspect-4/5"
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
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Fullscreen + Zoom */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                <button
                    onClick={onFullscreenOpen}
                    className="w-9 h-9 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/50 dark:border-slate-700/50 flex items-center justify-center shadow-lg cursor-pointer hover:bg-white dark:hover:bg-slate-700 hover:scale-105 transition-all text-slate-700 dark:text-slate-300"
                >
                    <Expand size={14} />
                </button>
            </div>

            {/* Nav arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={() => onIndexChange((activeIndex - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/40 dark:border-slate-700/40 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-white dark:hover:bg-slate-700 hover:scale-105 text-slate-700 dark:text-slate-300"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={() => onIndexChange((activeIndex + 1) % images.length)}
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
    );
}
