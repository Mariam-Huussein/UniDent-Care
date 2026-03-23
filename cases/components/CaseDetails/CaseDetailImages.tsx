"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import toothImg1 from "@/assets/images/tooth-img-1.jpg";
import toothImg2 from "@/assets/images/tooth-img-2.jpg";
import toothImg3 from "@/assets/images/tooth-img-3.jpg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";
import FullscreenModal from "./FullscreenModal";

import noToothFoundImg from "@/assets/images/no_tooth_found.png";

const FALLBACK_IMAGES = [
    noToothFoundImg.src,
];

interface CaseDetailImagesProps {
    patientName: string;
    imageUrls?: string[];
}

export default function CaseDetailImages({ patientName, imageUrls }: CaseDetailImagesProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const imagesToDisplay = imageUrls && imageUrls.length > 0 ? imageUrls : FALLBACK_IMAGES;

    return (
        <>
            <div className="relative w-full overflow-hidden">
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    loop={true}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    className="w-full h-[300px] sm:h-[400px] lg:h-[540px] case-detail-swiper"
                >
                    {imagesToDisplay.map((src, i) => (
                        <SwiperSlide key={i}>
                            <div className="h-full w-full bg-white">
                                <img
                                    src={src}
                                    alt={`${patientName} - Image ${i + 1}`}
                                    className={`w-full h-full object-cover select-none cursor-zoom-in ${src === noToothFoundImg.src ? "object-scale-down" : "object-cover"}`}
                                    onClick={() => setIsOpen(true)}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = noToothFoundImg.src;
                                        (e.target as HTMLImageElement).classList.remove("object-cover");
                                        (e.target as HTMLImageElement).classList.add("object-scale-down");
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none z-10" />
                {isOpen &&
                    <FullscreenModal
                        setIsOpen={setIsOpen}
                        activeIndex={activeIndex}
                        images={imagesToDisplay} />
                }
            </div>
        </>

    );
}
