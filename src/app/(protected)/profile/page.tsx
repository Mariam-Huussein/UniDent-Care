"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  UserRound,
  Mail,
  CalendarDays,
  Stethoscope,
  GraduationCap,
  HeartPulse,
  Phone,
  Hash,
  Award
} from "lucide-react";
import type { DoctorUser, StudentUser, PatientUser } from "@/features/auth/types";

export default function Profile() {
  const { t } = useLanguage();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role);

  if (!user || !role) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isDoctor = role === "Doctor";
  const isStudent = role === "Student";
  const isPatient = role === "Patient";

  const doctorUser = user as DoctorUser;
  const studentUser = user as StudentUser;
  const patientUser = user as PatientUser;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };



  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900/50 dark:to-indigo-900/50" />
        <div className="px-8 pb-8 pt-20 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-xl shrink-0 overflow-hidden">
            <UserRound size={64} />
          </div>
          <div className="flex-1 text-center md:text-start">
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center justify-center md:justify-start gap-3">
              {user.fullName || (user as any).name}
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${isDoctor ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : isStudent ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"}`}>
                {isDoctor && t.roles.Doctor}
                {isStudent && t.roles.Student}
                {isPatient && t.roles.Patient}
              </span>
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <Mail size={16} className="text-indigo-500" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <CalendarDays size={16} className="text-blue-500" /> {t.memberSince}: {formatDate(user.createAt)}
              </span>
              {isPatient && patientUser.phone && (
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <Phone size={16} className="text-teal-500" /> {patientUser.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Role-Specific Details Section */}
      <div className="w-full">
        
        {/* DOCTOR VIEW */}
        {isDoctor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div className="border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl transition-colors">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">{t.specialty}</span>
              <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 mt-3 flex items-center gap-3">
                <Stethoscope className="text-blue-600 dark:text-blue-500" strokeWidth={2.5} size={28} />
                {doctorUser.specialty || "General Dentistry"}
              </p>
            </div>
            <div className="border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl transition-colors">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">{t.universityId}</span>
              <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 mt-3 font-mono tracking-wider flex items-center gap-3">
                 <Hash className="text-blue-600 dark:text-blue-500" strokeWidth={2.5} size={28} />
                {doctorUser.universityId || "N/A"}
              </p>
            </div>
          </motion.div>
        )}

        {/* STUDENT VIEW */}
        {isStudent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <div className="border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-3xl transition-colors">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">{t.university}</span>
              <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 mt-3 flex items-center gap-3">
                <GraduationCap className="text-indigo-600 dark:text-indigo-500" strokeWidth={2.5} size={28} />
                {studentUser.university || "University"}
              </p>
            </div>
            <div className="border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-3xl transition-colors">
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">{t.level}</span>
              <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 mt-3 flex items-center gap-3">
                <Award className="text-indigo-600 dark:text-indigo-500" strokeWidth={2.5} size={28} />
                Level {studentUser.level || 1}
              </p>
            </div>
            <div className="border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-3xl transition-colors">
               <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">{t.universityId}</span>
              <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 mt-3 font-mono tracking-wider flex items-center gap-3">
                 <Hash className="text-indigo-600 dark:text-indigo-500" strokeWidth={2.5} size={28} />
                {studentUser.universityId || "N/A"}
              </p>
            </div>
          </motion.div>
        )}

        {/* PATIENT VIEW */}
        {isPatient && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            <div className="border border-teal-100 dark:border-teal-900/30 bg-teal-50/50 dark:bg-teal-900/10 p-6 rounded-3xl transition-colors">
              <span className="text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest">{t.age}</span>
              <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-200 mt-3 flex items-center gap-3">
                 <HeartPulse className="text-teal-600 dark:text-teal-500" strokeWidth={2.5} size={28} />
                {patientUser.age ? `${patientUser.age} years old` : "Not provided"}
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}