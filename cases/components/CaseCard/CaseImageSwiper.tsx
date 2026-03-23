"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import noToothFoundImg from "@/assets/images/no_tooth_found.png";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { CaseCardProps } from "../../types/caseCardProps.types";
import { getStatusConfig } from "../../utils/caseCard.utils";

interface CaseImageSwiperProps {
    caseItem: CaseCardProps["caseItem"];
}

export default function CaseImageSwiper({ caseItem }: CaseImageSwiperProps) {
    const statusConfig = getStatusConfig(caseItem.status);
    const imagesToDisplay = caseItem.imageUrls && caseItem.imageUrls.length > 0
        ? caseItem.imageUrls
        : [noToothFoundImg.src];

    return (
        <div className="relative w-full h-[220px] sm:h-[250px] flex-shrink-0 overflow-hidden bg-gray-50">
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={false}
                loop={imagesToDisplay.length > 1}
                className="w-full h-full case-card-swiper"
            >
                {imagesToDisplay.map((src, i) => (
                    <SwiperSlide key={i}>
                        <div className="w-full h-full object-cover">
                            <img
                                src={src}
                                alt={`${caseItem.patientName} - preview ${i + 1}`}
                                className={`w-full h-full object-cover ${src === noToothFoundImg.src ? "object-scale-down" : "object-cover"}`}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = noToothFoundImg.src;
                                }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10" />

            {/* Badge */}
            <span className={`absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text} backdrop-blur-sm`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                {statusConfig.label}
            </span>
        </div>
    );
}
