"use client";

import Link from "next/link";
import { useLanguage } from "../providers/LanguageProvider";
import Logo from "@/components/ui/Logo";
import { useEffect, useState } from "react";
import { getUserDetailsFromCookies } from "@/utils/sharedHelper";
import { User2, Menu, X } from "lucide-react"; // Added Menu and X icons

export default function Navbar() {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userRole } = getUserDetailsFromCookies();

  useEffect(() => {
    setMounted(true);
    const { token } = getUserDetailsFromCookies();
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!mounted) return null;

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Common link component to avoid repetition
  const NavLinks = ({ mobile = false }) => (
    <>
      <Link
        href="#features"
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {t.navFeatures}
      </Link>
      <Link
        href="#about"
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {t.navAbout}
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="cursor-pointer">
            <Logo iconClassName="w-10 md:w-12 block cursor-pointer" textClassName="text-xl md:text-2xl cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
          {/* <NavLinks /> */}
          {isLoggedIn ? (
            <Link
              href={userRole === "ClinicalDoctor" ? "/cases" : "/dashboard"}
              className="flex items-center gap-2 group transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white border-2 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform">
                <User2 className="w-5 h-5" />
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg"
            >
              {t.navSignIn}
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-6 text-base font-bold text-slate-600 dark:text-slate-300 animate-in slide-in-from-top-5 duration-200">
          <NavLinks mobile />
          <hr className="border-slate-100 dark:border-slate-800" />
          {isLoggedIn ? (
            <Link
              href={userRole === "ClinicalDoctor" ? "/cases" : "/dashboard"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 text-blue-600 dark:text-blue-400"
            >
              <User2 className="w-5 h-5" />
              {t.navDashboard || "Dashboard"}
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-xl text-center shadow-lg"
            >
              {t.navSignIn}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}