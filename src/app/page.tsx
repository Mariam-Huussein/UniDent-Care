"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Stethoscope,
  GraduationCap,
  UserRound,
  ArrowRight,
  ShieldCheck,
  Activity,
  ChevronRight,
} from "lucide-react";
import { FaTooth } from "react-icons/fa";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Home() {
  const { t, language } = useLanguage();

  const isRtl = language === "ar";

  const roles = [
    {
      title: t.roles.Doctor,
      desc: t.rolesDescDoctor,
      icon: <Stethoscope size={32} />,
      href: "/signup/doctor",
      color: "blue",
      stats: t.statsVerified,
    },
    {
      title: t.roles.Student,
      desc: t.rolesDescStudent,
      icon: <GraduationCap size={32} />,
      href: "/signup/student",
      color: "indigo",
      stats: t.statsFuture,
    },
    {
      title: t.roles.Patient,
      desc: t.rolesDescPatient,
      icon: <UserRound size={32} />,
      href: "/signup/patient",
      color: "teal",
      stats: t.statsQuality,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col overflow-x-hidden transition-colors duration-300">
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50">
              <FaTooth size={22} />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              UniDent<span className="text-blue-600 dark:text-blue-400">Care</span>
            </span>
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

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-[100px] -z-10 transition-colors duration-300" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold mb-8 transition-colors duration-300"
          >
            <ShieldCheck size={14} />
            <span>{t.heroBadge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 ${isRtl ? 'font-arabic' : ''}`}
          >
            {t.heroTitle1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {t.heroTitle2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
          >
            {t.heroDesc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/signup/patient"
              className="group h-14 px-10 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-blue-200 dark:shadow-blue-900/50 hover:bg-blue-700 dark:hover:bg-blue-600 hover:-translate-y-1 transition-all"
            >
              {t.getStartedBtn}
              <ArrowRight
                size={20}
                className={`group-hover:${isRtl ? '-translate-x-1' : 'translate-x-1'} transition-transform ${isRtl ? 'rotate-180' : ''}`}
              />
            </Link>
            <Link
              href="#features"
              className="h-14 px-10 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
            >
              {t.learnMoreBtn}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              {t.choosePathTitle}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t.choosePathDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={role.href} className="group block h-full">
                  <div className={`h-full bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-${role.color}-100 dark:hover:shadow-${role.color}-900/20 hover:border-${role.color}-200 dark:hover:border-${role.color}-800 transition-all duration-300 relative overflow-hidden`}>
                    <div
                      className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} p-8 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-125 transition-transform duration-500 text-${role.color}-600 dark:text-${role.color}-400`}
                    >
                      {role.icon}
                    </div>

                    <div
                      className={`w-14 h-14 rounded-2xl bg-${role.color}-50 dark:bg-${role.color}-900/30 text-${role.color}-600 dark:text-${role.color}-400 flex items-center justify-center mb-8 group-hover:bg-${role.color}-600 dark:group-hover:bg-${role.color}-500 group-hover:text-white transition-colors duration-300`}
                    >
                      {role.icon}
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                      {role.title}
                      <ChevronRight className={`opacity-0 group-hover:opacity-100 group-hover:${isRtl ? '-translate-x-2' : 'translate-x-2'} transition-all ${isRtl ? 'rotate-180' : ''}`} />
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                      {role.desc}
                    </p>

                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
                      <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-${role.color}-600 dark:group-hover:text-${role.color}-400 transition-colors`}>
                        {role.stats}
                      </span>
                      <Activity size={16} className="text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto py-12 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50 dark:opacity-40">
            <FaTooth size={20} className="dark:text-white" />
            <span className="font-bold dark:text-white">UniDent Care</span>
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
    </div>
  );
}
