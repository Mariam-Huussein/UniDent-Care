"use client";

import { Link } from "lucide-react";
import { useLanguage } from "../providers/LanguageProvider";
import Logo from "@/components/ui/Logo";

export default function Footer() {
    const { t } = useLanguage();
  return (
      <footer className="mt-auto py-12 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="grayscale opacity-50 dark:opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <Logo iconClassName="w-6 md:w-8 block" textClassName="text-lg md:text-xl" />
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} UniDent Care. {t.footerRights}
          </p>
          <div className="flex gap-6 text-slate-400 text-sm font-medium">
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
              {t.footerPrivacy}
            </Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
              {t.footerTerms}
            </Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
              {t.footerContact}
            </Link>
          </div>
        </div>
      </footer>
  )
}