import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface FullscreenImageModalProps {
    isOpen: boolean;
    images: string[];
    activeIndex: number;
    onClose: () => void;
    onIndexChange: (index: number) => void;
}

export default function FullscreenImageModal({ isOpen, images, activeIndex, onClose, onIndexChange }: FullscreenImageModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/85 dark:bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center"
                    onClick={onClose}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); onIndexChange((activeIndex - 1 + images.length) % images.length); }}
                                className="absolute left-4 z-50 w-11 h-11 rounded-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10 dark:border-slate-700/50 flex items-center justify-center text-white hover:bg-white/20 dark:hover:bg-slate-700/80 transition-all cursor-pointer"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onIndexChange((activeIndex + 1) % images.length); }}
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
                                onClick={(e) => { e.stopPropagation(); onIndexChange(i); }}
                                className={`transition-all duration-300 rounded-full cursor-pointer ${i === activeIndex ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/60"
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
