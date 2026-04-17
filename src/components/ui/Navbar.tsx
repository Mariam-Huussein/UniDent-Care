"use client";

import Link from "next/link";
import { useLanguage } from "../providers/LanguageProvider";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
      const { t } = useLanguage();
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Logo iconClassName="w-10 md:w-12 block" textClassName="text-xl md:text-2xl" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
            <Link
              href="#features"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t.navFeatures}
            </Link>
            <Link
              href="#about"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t.navAbout}
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-slate-200 dark:shadow-slate-800"
            >
              {t.navSignIn}
            </Link>
          </div>
        </div>
      </nav>

    );
}