import SelectItems from "@/components/common/SelectItems";
import { cityList, genderList } from "@/constants/enums";
import { motion } from "framer-motion";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

export const PatientStep = ({ register, onSubmit, isPending, control }: any) => (
  <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
    <div className="mb-10 flex items-center gap-4">
      <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
        <UserPlus />
      </div>
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Patient Registration</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Step 1: Setup patient profile</p>
      </div>
    </div>

    <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl max-w-2xl mx-auto shadow-sm transition-all">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input {...register("fullName")} required className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:border-indigo-500 dark:focus:border-indigo-600 outline-none transition-all" placeholder="Patient Name" />
          </div>

          {/* National ID */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">National ID</label>
            <input {...register("NationalId")} required className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:border-indigo-500 dark:focus:border-indigo-600 outline-none transition-all" placeholder="14 Digits" />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <input type="tel" {...register("phoneNumber")} required className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:border-indigo-500 dark:focus:border-indigo-600 outline-none transition-all" placeholder="01xxxxxxxxx" />
          </div>
          {/* Birth Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Birth Date</label>
            <input type="date" {...register("birthDate")} required className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 focus:border-indigo-500 dark:focus:border-indigo-600 outline-none transition-all" />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Gender</label>
            <Controller
              control={control}
              name="gender"
              defaultValue="Male"
              render={({ field: { onChange, value } }) => (
                <SelectItems
                  options={genderList}
                  value={value || ""}
                  onChange={onChange}
                  placeholder="Select Gender"
                />
              )}
            />
          </div>

          {/* City */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">City</label>
            <Controller
              control={control}
              name="city"
              defaultValue="Cairo"
              render={({ field: { onChange, value } }) => (
                <SelectItems
                  options={cityList}
                  value={value || ""}
                  onChange={onChange}
                  placeholder="Select City"
                />
              )}
            />
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
          <button type="submit" disabled={isPending} className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
            {isPending ? <Loader2 className="animate-spin" /> : <><UserCheck size={18} /> Continue to Case</>}
          </button>
        </div>
      </form>
    </div>
  </motion.div>
);