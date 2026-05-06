
import { cityList } from "@/constants/enums";
import { PatientData } from "../types/AddCase.types";
import { motion } from "framer-motion";
import { BadgePlus, CheckCircle2, ChevronRight, Phone, MapPin, User, Baby } from "lucide-react";
import FormSection from "./FormSection";
import { ShieldCheck } from "lucide-react";

export default function PatientInfoCard({ patient, onContinue }: { patient: PatientData; onContinue: () => void }) {
  const initials = (patient?.fullName || "").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const gender = patient.gender === 0 ? "Male" : "Female";
  const city = cityList;
  const age = patient.age ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
    >
      <FormSection icon={ShieldCheck} title="Patient Found" subtitle="Verify the details below before adding a case" iconColor="from-emerald-500 to-teal-600">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-5 p-4 bg-emerald-50/60 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/40">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/30 shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{patient.fullName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: {patient.nationalId}</p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800/40">
              <CheckCircle2 size={12} /> Verified
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: Phone, label: "Phone", value: patient.phone || "—" },
            { icon: MapPin, label: "City", value: city },
            { icon: User, label: "Gender", value: gender },
            { icon: Baby, label: "Age", value: age ? `${age} years` : "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-slate-700/50">
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                <Icon size={14} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="my-btn w-full py-3 group"
        >
          <BadgePlus size={16} className="group-hover:scale-110 transition-transform" />
          Continue to Add Case
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </FormSection>
    </motion.div>
  );
}