"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, Phone, MapPin, Calendar, Mail } from "lucide-react";
import { UniversityLookup } from "@/server/getUniversities.action";

interface StudentProfileViewProps {
  student: any;
  t: any;
  universities?: UniversityLookup[];
}

export function StudentProfileView({ student, t, universities = [] }: StudentProfileViewProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString || dateString.startsWith("0001")) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const getUniversityName = () => {
    if (student?.universityId && universities.length > 0) {
      const match = universities.find(u => u.id === student.universityId);
      if (match) return match.name;
    }
    return student?.university || "N/A";
  };

  const academicFields = [
    { icon: GraduationCap, color: "indigo", label: t?.profile?.university || "University", value: getUniversityName() },
    { icon: Award,         color: "purple", label: t?.profile?.level      || "Level",      value: student?.level ? `Level ${student.level}` : "N/A" },
  ];

  const personalFields = [
    { icon: Phone,    color: "blue",  label: t?.profile?.phoneNumber || "Phone",    value: student?.phoneNumber || "—" },
    { icon: Mail,     color: "violet",label: t?.profile?.email       || "Email",    value: student?.email       || "—" },
    { icon: Calendar, color: "amber", label: t?.profile?.birthDate   || "Born",     value: formatDate(student?.dateOfBirth) },
    { icon: MapPin,   color: "rose",  label: t?.profile?.address     || "Address",  value: student?.address     || "—" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    blue:   "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    violet: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
    amber:  "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    rose:   "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
  };

  const FieldGrid = ({ fields }: { fields: typeof academicFields }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
      {fields.map(({ icon: Icon, color, label, value }) => (
        <div key={label} className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl shrink-0 ${colorMap[color]}`}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{label}</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          {t?.profile?.academicInfo || "Academic Information"}
        </h3>
        <FieldGrid fields={academicFields} />
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      <div className="p-4 sm:p-6">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          {t?.profile?.personalInfo || "Personal Information"}
        </h3>
        <FieldGrid fields={personalFields} />
      </div>
    </motion.div>
  );
}
