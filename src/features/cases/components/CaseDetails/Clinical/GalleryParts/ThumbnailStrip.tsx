import { motion } from "framer-motion";

interface ThumbnailStripProps {
    images: string[];
    activeIndex: number;
    onIndexChange: (index: number) => void;
}

export default function ThumbnailStrip({ images, activeIndex, onIndexChange }: ThumbnailStripProps) {
    if (images.length <= 1) return null;

    return (
        <div className="flex gap-2 overflow-x-auto pb-1 patient-details-scrollbar">
            {images.map((src, i) => (
                <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onIndexChange(i)}
                    className={`shrink-0 w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${i === activeIndex
                            ? "border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 ring-2 ring-indigo-200/50 dark:ring-indigo-900/30"
                            : "border-slate-200/80 dark:border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                >
                    <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                </motion.button>
            ))}
        </div>
    );
}
