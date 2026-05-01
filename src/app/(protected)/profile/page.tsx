"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserRound,
  Mail,
  CalendarDays,
  Stethoscope,
  GraduationCap,
  HeartPulse,
  Phone,
  Hash,
  Award,
  Users,
  Clock,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Hospital,
} from "lucide-react";
import type { DoctorUser, StudentUser, PatientUser } from "@/features/auth/types";
import { doctorDashboardService } from "@/features/dashboard/services/doctorDashboardService";
import { containerVariants, itemVariants } from "@/lib/animations";

export default function Profile() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role);
  
  const [doctorStats, setDoctorStats] = useState<{
    totalStudents: number;
    pendingRequests: number;
    approvedRequests: number;
  } | null>(null);
  const [universityName, setUniversityName] = useState<string>("");
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (role === "Doctor" && user?.publicId) {
      fetchDoctorData();
    }
  }, [role, user?.publicId]);

  const fetchDoctorData = async () => {
    try {
      setLoadingStats(true);
      const [statsRes, univRes] = await Promise.all([
        doctorDashboardService.getDoctorDetails(user!.publicId),
        doctorDashboardService.getUniversitiesLookup()
      ]);
      
      setDoctorStats({
        totalStudents: statsRes.totalStudents,
        pendingRequests: statsRes.pendingRequests,
        approvedRequests: statsRes.approvedRequests,
      });

      // Resolve university name
      const univ = univRes.find(u => u.id === statsRes.universityId);
      if (univ) {
        setUniversityName(univ.name);
      } else {
        setUniversityName(statsRes.universityId || "N/A");
      }
    } catch (err) {
      console.error("Failed to fetch doctor data for profile:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!user || !role) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
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
    return new Date(dateString).toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden pb-20">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      <motion.div
        className="relative max-w-6xl mx-auto p-6 space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Header Profile Card */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[2.5rem] bg-white/70 dark:bg-slate-900/70 border border-white dark:border-slate-800/40 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-40 bg-linear-to-r from-indigo-600/20 via-blue-600/20 to-purple-600/20 dark:from-indigo-900/40 dark:via-blue-900/40 dark:to-purple-900/40" />
          
          <div className="px-8 pb-10 pt-20 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative w-36 h-36 rounded-full border-4 border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-2xl shrink-0 overflow-hidden">
                <UserRound size={72} strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-2 right-2 w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles size={20} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-start space-y-4">
              <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-800 dark:text-white flex items-center justify-center md:justify-start gap-4 tracking-tight">
                  {user.fullName || (user as any).name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-sm border ${
                    isDoctor ? "bg-blue-500 text-white border-blue-400" : 
                    isStudent ? "bg-indigo-500 text-white border-indigo-400" : 
                    "bg-teal-500 text-white border-teal-400"
                  }`}>
                    {isDoctor && (isRtl ? "دكتور" : "Doctor")}
                    {isStudent && (isRtl ? "طالب" : "Student")}
                    {isPatient && (isRtl ? "مريض" : "Patient")}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {isRtl ? "الملف الشخصي" : "Active Profile"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                <InfoChip icon={<Mail size={14} />} label={user.email} color="indigo" />
                <InfoChip icon={<CalendarDays size={14} />} label={`${isRtl ? "عضو منذ" : "Member since"}: ${formatDate(user.createAt)}`} color="blue" />
                {isPatient && patientUser.phone && (
                  <InfoChip icon={<Phone size={14} />} label={patientUser.phone} color="teal" />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* DOCTOR SPECIALTY & ID */}
            {isDoctor && (
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProfileDetailCard 
                  label={isRtl ? "التخصص" : "Specialty"} 
                  value={doctorUser.specialty || (isRtl ? "طب الأسنان العام" : "General Dentistry")} 
                  icon={<Stethoscope size={28} />} 
                  color="blue"
                />
                <ProfileDetailCard 
                  label={isRtl ? "الجامعة" : "University"} 
                  value={universityName || doctorUser.universityId || "N/A"} 
                  icon={<Hospital size={28} />} 
                  color="indigo"
                />
              </motion.div>
            )}

            {/* STUDENT DETAILS */}
            {isStudent && (
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <ProfileDetailCard label={t.university} value={studentUser.university} icon={<GraduationCap size={28} />} color="indigo" />
                <ProfileDetailCard label={t.level} value={`Level ${studentUser.level}`} icon={<Award size={28} />} color="blue" />
                <ProfileDetailCard label={t.universityId} value={studentUser.universityId} icon={<Hash size={28} />} color="purple" />
              </motion.div>
            )}

            {/* PATIENT DETAILS */}
            {isPatient && (
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProfileDetailCard 
                  label={t.age} 
                  value={patientUser.age ? `${patientUser.age} ${isRtl ? "سنة" : "years old"}` : (isRtl ? "غير متوفر" : "Not provided")} 
                  icon={<HeartPulse size={28} />} 
                  color="teal" 
                />
              </motion.div>
            )}

            {/* About / Professional Bio (Placeholder for future) */}
            <motion.div variants={itemVariants} className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-100 dark:border-slate-800/60">
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4">
                {isRtl ? "عن المستخدم" : "About Me"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {isRtl 
                  ? "عضو نشط في منصة UniDent-Care، مكرس لتقديم أفضل رعاية صحية ودعم أكاديمي في مجال طب الأسنان."
                  : "An active member of the UniDent-Care platform, dedicated to providing the best healthcare and academic support in the field of dentistry."}
              </p>
            </motion.div>
          </div>

          {/* Stats Column (For Doctors) */}
          {isDoctor && (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  {isRtl ? "الإحصائيات المهنية" : "Professional Stats"}
                </h3>
                <button 
                  onClick={fetchDoctorData}
                  className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                >
                  <RefreshCw size={14} className={loadingStats ? "animate-spin" : ""} />
                </button>
              </div>

              <div className="space-y-4">
                <StatMiniCard 
                  label={isRtl ? "إجمالي الطلاب" : "Total Students"} 
                  value={doctorStats?.totalStudents ?? doctorUser.totalStudents ?? 0} 
                  icon={<Users size={20} />} 
                  color="blue"
                  loading={loadingStats}
                />
                <StatMiniCard 
                  label={isRtl ? "طلبات قيد الانتظار" : "Pending Requests"} 
                  value={doctorStats?.pendingRequests ?? doctorUser.pendingRequests ?? 0} 
                  icon={<Clock size={20} />} 
                  color="amber"
                  loading={loadingStats}
                />
                <StatMiniCard 
                  label={isRtl ? "طلبات معتمدة" : "Approved Requests"} 
                  value={doctorStats?.approvedRequests ?? doctorUser.approvedRequests ?? 0} 
                  icon={<CheckCircle2 size={20} />} 
                  color="emerald"
                  loading={loadingStats}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function InfoChip({ icon, label, color }: { icon: React.ReactNode; label: string; color: "indigo" | "blue" | "teal" }) {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100/50 dark:border-indigo-800/40",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-100/50 dark:border-blue-800/40",
    teal: "text-teal-600 bg-teal-50 dark:bg-teal-900/30 border-teal-100/50 dark:border-teal-800/40",
  };

  return (
    <span className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-bold shadow-sm transition-all hover:scale-105 ${colors[color]}`}>
      {icon} {label}
    </span>
  );
}

function ProfileDetailCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`group relative p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${color}-500/5 rounded-full blur-2xl group-hover:bg-${color}-500/10 transition-all duration-500`} />
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500`}>{label}</span>
      <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mt-4 flex items-center gap-4">
        <span className={`text-${color}-600 dark:text-${color}-400 bg-${color}-50 dark:bg-${color}-900/30 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </span>
        <span className="truncate">{value}</span>
      </p>
    </div>
  );
}

function StatMiniCard({ label, value, icon, color, loading }: { label: string; value: number; icon: React.ReactNode; color: string; loading: boolean }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-100/50",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/30 border-amber-100/50",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100/50",
  };

  return (
    <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]} group-hover:rotate-12 transition-transform duration-500`}>
          {icon}
        </div>
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      {loading ? (
        <div className="h-8 w-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
      ) : (
        <span className="text-2xl font-black text-slate-800 dark:text-white">{value}</span>
      )}
    </div>
  );
}
