"use client";

import Image from "next/image";
import logoLight from "@/assets/images/logoLight.png";
import logoDark from "@/assets/images/logoDark.png";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface LogoProps {
  showText?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export default function Logo({
  showText = true,
  className = "",
  iconClassName = "w-10 sm:w-12",
  textClassName = "text-2xl sm:text-3xl",
}: LogoProps) {
  const { language } = useLanguage();
  const isRtl = language === "ar";

  return (
    <div className={`flex items-center align-center gap-0.5 justify-center transition-all duration-300  ${className}`}>
      <div className={`flex items-center justify-center shrink-0 hover:animate-pulse transition-transform duration-500 ${iconClassName}`}>
        <Image
          src={logoLight}
          alt="UniDent Care Logo"
          priority
          className="object-contain dark:hidden drop-shadow-sm w-full h-auto"
        />
        <Image
          src={logoDark}
          alt="UniDent Care Logo"
          priority
          className="object-contain hidden dark:block drop-shadow-sm w-full h-auto"
        />
      </div>

      {showText && (
        <h1 className={`${textClassName} font-extrabold tracking-tight whitespace-nowrap flex items-end gap-0.2 ${isRtl ? 'font-arabic' : ''}`}>
          <span>
            <span className="bg-clip-text text-transparent bg-linear-to-r from-slate-800 to-indigo-600 dark:from-white dark:to-slate-200">
              Uni
            </span>
            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">
              Dent
            </span>
          </span>
          <span className="text-[0.55em] font-semibold text-italic text-slate-500 dark:text-slate-400 uppercase tracking-tight relative top-[2px]">
            Care
          </span>

        </h1>
      )}
    </div>
  );
}