import FullscreenImageModal from "@/features/cases/components/CaseDetails/Clinical/GalleryParts/FullscreenImageModal";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";

export default function MediaSlider({ medias }: { medias: { id: string; mediaUrl: string }[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const urls = medias.map((m) => m.mediaUrl);
    const open = (idx: number) => { setActiveIndex(idx); setLightboxOpen(true); };

    return (
        <div className="relative px-8 mt-2">
            <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="-ml-2">
                    {medias.map((m, idx) => (
                        <CarouselItem key={m.id} className="pl-2 basis-1/4 sm:basis-1/5 md:basis-1/6">
                            <button
                                type="button"
                                onClick={() => open(idx)}
                                className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                            >
                                <img
                                    src={m.mediaUrl}
                                    alt={`Media ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-xl" />
                            </button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {/* Only show arrows if there are enough images to scroll */}
                {medias.length > 4 && (
                    <>
                        <CarouselPrevious className="w-7 h-7 -left-3 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                        <CarouselNext className="w-7 h-7 -right-3 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                    </>
                )}
            </Carousel>

            <FullscreenImageModal
                isOpen={lightboxOpen}
                images={urls}
                activeIndex={activeIndex}
                onClose={() => setLightboxOpen(false)}
                onIndexChange={setActiveIndex}
            />
        </div>
    );
}
