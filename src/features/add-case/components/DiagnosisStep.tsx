import React from "react";
import { Controller } from "react-hook-form";
import { ClipboardPlus, Stethoscope, CheckCircle2, Loader2, Info } from "lucide-react";
import OdontogramForm from "../components/OdontogramForm";
import { motion } from "framer-motion";

export const DiagnosisStep = ({ control, patientId, historyData, onToothDataUpdate, watchedTeeth, onSubmit, isPending }: any) => (
  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div className="lg:col-span-8 space-y-6">
      <header className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-lg"><ClipboardPlus /></div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Case & Diagnosis</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Patient ID: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{patientId}</span></p>
        </div>
      </header>

      <section className="bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm backdrop-blur-xl overflow-visible">
        <div className="flex items-center gap-3 mb-6">
          <Stethoscope className="text-indigo-600 dark:text-indigo-400" size={20} />
          <h3 className="font-bold text-slate-800 dark:text-white">Interactive Odontogram Chart</h3>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex justify-center">
          <Controller
            control={control}
            name="InitialDiagnosis.TeethNumbers"
            render={({ field }) => (
              <OdontogramForm
                history={historyData?.data?.data?.items || []}
                selectedTeeth={field.value}
                onToothSelect={(nums) => field.onChange(nums)}
                onToothDataUpdate={onToothDataUpdate}
              />
            )}
          />
        </div>
      </section>

      <button onClick={onSubmit} disabled={isPending} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all">
        {isPending ? <Loader2 className="animate-spin" /> : <><CheckCircle2 /> Finalize & Submit Case</>}
      </button>
    </div>

    <aside className="lg:col-span-4">
      <div className="sticky top-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-sm transition-all">
        <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Info className="text-indigo-600 dark:text-indigo-400" size={18} /> Summary Preview
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-500">Selected Teeth</span>
            <span className="text-indigo-600 dark:text-indigo-400">{watchedTeeth?.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchedTeeth?.map((t: any) => (
              <span key={t} className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  </motion.div>
);