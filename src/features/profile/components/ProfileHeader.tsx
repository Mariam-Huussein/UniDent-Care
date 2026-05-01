"use client";

import { motion } from "framer-motion";
import { Mail, CalendarDays, Edit2, User2 } from "lucide-react";

interface ProfileHeaderProps {
  user: any;
  role: string;
  onEditClick: () => void;
  t: any;
}

export function ProfileHeader({ user, role, onEditClick, t }: ProfileHeaderProps) {
  const isDoctor = role === "Doctor";
  const isStudent = role === "Student";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const name = user?.fullName || user?.name || "User";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const gradientFrom = isDoctor ? "from-blue-600" : isStudent ? "from-indigo-600" : "from-teal-600";
  const gradientTo = isDoctor ? "to-blue-800" : isStudent ? "to-indigo-800" : "to-teal-800";
  const accentColor = isDoctor ? "text-blue-500" : isStudent ? "text-indigo-500" : "text-teal-500";
  const ringColor = isDoctor ? "ring-blue-500/30" : isStudent ? "ring-indigo-500/30" : "ring-teal-500/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
    >
      {/* Gradient Banner */}
      <div className={`h-36 bg-linear-to-br ${gradientFrom} ${gradientTo} relative`}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 w-24 h-24 rounded-full border-2 border-white/40" />
          <div className="absolute top-12 right-20 w-16 h-16 rounded-full border-2 border-white/20" />
          <div className="absolute -bottom-4 left-12 w-32 h-32 rounded-full border-2 border-white/30" />
        </div>

        {/* Edit button */}
        <button
          onClick={onEditClick}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-bold transition-all duration-200 border border-white/20"
        >
          <Edit2 size={14} />
          {t?.profile?.editProfile || "Edit Profile"}
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-6 sm:px-8 pb-6 -mt-14 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
          {/* Avatar */}
          <div className={`w-28 h-28 rounded-2xl bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center ring-4 ${ringColor} shrink-0`}>
            <User2 size={50} className={`text-3xl font-black ${accentColor}`} />
          </div>
          {/* Name + Meta */}
          <div className="flex-1 text-center sm:text-start pt-2 sm:pt-4">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <CalendarDays size={14} className={accentColor} />
                {t?.memberSince || "Joined"} {formatDate(user?.createAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
