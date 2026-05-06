"use client";

import { motion } from "framer-motion";
import { HeartPulse, Phone, CreditCard, Calendar, MapPin, Mail } from "lucide-react";
import { cityMap } from "@/constants/enums";

interface PatientProfileViewProps {
  patient: any;
  t: any;
}

export function PatientProfileView({ patient, t }: PatientProfileViewProps) {
  const getGenderText = (gender?: number) => {
    if (gender === 0) return t?.profile?.male   || "Male";
    if (gender === 1) return t?.profile?.female || "Female";
    return "N/A";
  };

  const getCityName = (cityValue?: number) => {
    if (cityValue === undefined || cityValue === null) return "—";
    const entry = Object.entries(cityMap).find(([, v]) => v === cityValue);
    return entry ? entry[0] : "—";
  };

  const fields = [
    { icon: Phone,     color: "blue",   label: t?.profile?.phoneNumber || "Phone",      value: patient?.phone      || "—" },
    { icon: Mail,      color: "violet", label: t?.profile?.email       || "Email",      value: patient?.email      || "—" },
    { icon: CreditCard,color: "indigo", label: t?.profile?.nationalId  || "National ID",value: patient?.nationalId || "—" },
    { icon: Calendar,  color: "amber",  label: t?.profile?.age         || "Age",        value: patient?.age ? `${patient.age} ${t?.profile?.yearsOld || "years old"}` : "—" },
    { icon: HeartPulse,color: "rose",   label: t?.profile?.gender      || "Gender",     value: getGenderText(patient?.gender) },
    { icon: MapPin,    color: "teal",   label: t?.profile?.city        || "City",       value: getCityName(patient?.city) },
  ];

  const colorMap: Record<string, string> = {
    blue:   "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    violet: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    amber:  "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    rose:   "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
    teal:   "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          {t?.profile?.personalInfo || "Personal Information"}
        </h3>
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
      </div>
    </motion.div>
  );
}
