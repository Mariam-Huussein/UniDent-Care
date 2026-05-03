"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock12, ArrowRight, Stethoscope, GraduationCap, User } from "lucide-react";
import { StudentDashboardRequestItem } from "../../types/studentDashboard.types";
import { getRequestStatusConfig } from "./getRequestStatusConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import noToothFoundImg from "@/assets/images/no_tooth_found.png";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { PiTooth } from "react-icons/pi";

const timeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(days / 365);
    return `${years}y ago`;
};

export function StudentRequestCard({ item, index }: { item: StudentDashboardRequestItem; index: number }) {
  const sc = getRequestStatusConfig(item.status);

  const imagesToDisplay = item.imageUrls && item.imageUrls.length > 0
      ? item.imageUrls
      : [noToothFoundImg.src];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, type: 'spring', bounce: 0.3 }}
      className="w-full flex justify-center h-full"
    >
      <div className="group relative flex flex-col bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden w-11/12 hover:border-gray-200 hover:dark:border-slate-600 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:dark:shadow-none transition-all duration-300">
        
        {/* Image Swiper */}
        <div className="relative w-full h-[220px] sm:h-[250px] shrink-0 overflow-hidden bg-gray-50 dark:bg-slate-800 transition-colors">
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
                                alt={`${item.patientName} - preview ${i + 1}`}
                                className={`w-full h-full object-cover ${src === noToothFoundImg.src ? "object-scale-down" : "object-cover"}`}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = noToothFoundImg.src;
                                }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10" />

            {/* Badge */}
            <span className={`absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} backdrop-blur-sm`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
            </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3.5 sm:p-4">
            <div className="flex flex-col gap-2">
                {/* Title & Time */}
                <div className="flex items-center justify-between">
                    <h3 className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-slate-100 truncate leading-tight transition-colors">
                        {item.patientName}
                    </h3>
                    <span className="inline-flex items-center text-xs gap-1">
                        <Clock12 size={16} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                        <span className="font-medium text-gray-500 dark:text-slate-400 transition-colors">{timeAgo(item.createAt)}</span>
                    </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-1 line-clamp-2 transition-colors">
                    {item.description || "No description provided."}
                </p>

                {/* Detail chips */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {item.caseName && (
                        <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-md transition-colors">
                            <span className="font-medium">{item.caseName}</span>
                        </div>
                    )}

                    {item.studentName && (
                        <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-md transition-colors">
                            <GraduationCap size={14} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                            <span className="font-medium">{item.studentName} {item.level && `· Y${item.level}`}</span>
                        </div>
                    )}

                    {item.doctorName && (
                        <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-md transition-colors">
                            <Stethoscope size={14} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                            <span className="font-medium">Dr. {item.doctorName}</span>
                        </div>
                    )}

                    {item.university && (
                        <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-md transition-colors">
                            <User size={14} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                            <span className="font-medium">{item.university}</span>
                        </div>
                    )}
                    {item.diagnosisdto[0]?.caseTypeName && (
                        <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-md transition-colors">
                            <PiTooth size={14} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                            <span className="font-medium">{item.diagnosisdto[0].caseTypeName}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions (View Details) */}
            <div className="flex items-center justify-end gap-2 pt-3 sm:pt-4 mt-auto">
                <Link
                    href={`/my-cases/${item.patientCasePublicId}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 sm:py-2 rounded-xl text-sm font-semibold transition-all duration-300 group/btn"
                >
                    Review Request
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </div>

      </div>
    </motion.div>
  );
}