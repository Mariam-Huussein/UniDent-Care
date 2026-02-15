"use client";

import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

export default function FullscreenModal({ setIsOpen, activeIndex, images }: { setIsOpen: (isOpen: boolean) => void, activeIndex: number, images: string[] }) {
    return (<div className="fixed inset-0 bg-white/20 backdrop-blur-sm z-50 flex items-center justify-center">

        {/* Close Button */}
        <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-50 my-btn-outline px-1 py-1 rounded-full"
        >
            <X size={24} />
        </button>

        <div className="w-full h-full flex items-center justify-center">
            <Swiper
                modules={[Navigation, Pagination, Zoom]}
                navigation
                pagination={{ clickable: true }}
                zoom={{ maxRatio: 3 }}
                initialSlide={activeIndex}
                className="w-full h-full"
            >
                {images.map((src, i) => (
                    <SwiperSlide key={i}>
                        <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                            <img
                                src={src}
                                alt={`fullscreen-${i}`}
                                className="max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-in"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    </div>
    );
}