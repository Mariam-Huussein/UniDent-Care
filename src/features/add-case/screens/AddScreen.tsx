"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, ChevronRight,
  Loader2, AlertCircle, CheckCircle2, UserPlus, ArrowRight,
  BadgePlus, Upload, X, ImageIcon, FlaskConical, FileText,
  Layers, ClipboardList, Sparkles,
  History, Eye, EyeOff, RefreshCw, ShieldCheck, Baby,
  ChevronLeft,
} from "lucide-react";

import { getUserDetailsFromCookies } from "@/utils/sharedHelper";
import { cityMap, cityList, Gender } from "@/constants/enums";
import SelectItems from "@/components/common/SelectItems";
import { PatientData, PatientLookupResponse, PatientCreateResponse, DiagnosisHistoryItem, Step } from "@/features/add-case/types/AddCase.types";
import { PatientFormValues, CaseFormValues, patientSchema, caseSchema } from "@/features/add-case/schema/addCaseSchema";
import FormSection from "@/features/add-case/components/FormSection";
import FieldWrap from "@/features/add-case/components/FieldWrap";
import StepBar from "../components/StepBar";
import PatientInfoCard from "../components/PatientInfoCard";
import OdontogramForm from "../components/OdontogramForm";
import ImageDropzone from "../components/ImageDropzone";
import axios from "axios";



const apiV2 = axios.create({
  baseURL: "https://dental-hup1.runasp.net/api/v2/",
});
export const getStageName = (stage: number | string) => {
  if (stage === 0 || stage === "AI") return "AI Exam";
  if (stage === 1 || stage === "BasicClinic") return "Clinical";
  return String(stage);
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-200";

export default function AddCaseScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId: cookieUserId, userRole, universityId } = getUserDetailsFromCookies();
  const createdById = cookieUserId || "";

  // ── Derive step & nid from URL ───────────────────────────────────────────────
  const urlStep = (searchParams.get("step") as Step) || "lookup";
  const urlNid = searchParams.get("nid") || "";

  // ── Helper: navigate to a step, preserving nid ──────────────────────────────
  const goToStep = useCallback((nextStep: Step, nid?: string) => {
    const params = new URLSearchParams();
    params.set("step", nextStep);
    if (nid) params.set("nid", nid);
    else if (urlNid) params.set("nid", urlNid);
    router.push(`?${params.toString()}`);
  }, [router, urlNid]);

  // ── Wizard state ─────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState(urlNid);
  const [searchLoading, setSearchLoading] = useState(false);
  const [foundPatient, setFoundPatient] = useState<PatientData | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [history, setHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [odontogramKey, setOdontogramKey] = useState(0);

  // ── Patient form ──────────────────────────────────────────────────────────────
  const patientForm = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: { gender: 0, city: 0 },
  });

  // ── Case form ─────────────────────────────────────────────────────────────────
  const caseForm = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      IsPublic: true,
      NationalId: urlNid,
      InitialDiagnosis: { Stage: 1, TeethNumbers: [], Notes: "", CaseTypeId: "" },
    },
  });

  // ── On mount / nid change: re-fetch patient if we land on a step that needs it
  useEffect(() => {
    if (urlNid && (urlStep === "patient-found" || urlStep === "add-case")) {
      // Re-hydrate patient data from the API on refresh
      apiV2.get<PatientLookupResponse>("/patients", { params: { NationalId: urlNid } })
        .then((res) => {
          const items = res.data?.data?.items;
          if (items && items.length > 0) {
            setFoundPatient(items[0]);
            caseForm.setValue("NationalId", items[0].nationalId);
            fetchHistory(urlNid);
          } else {
            // Patient no longer found — fall back to lookup
            goToStep("lookup");
          }
        })
        .catch(() => goToStep("lookup"));
    }
    if (urlNid && urlStep === "patient-form") {
      patientForm.setValue("nationalId", urlNid);
      caseForm.setValue("NationalId", urlNid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Patient lookup ────────────────────────────────────────────────────────────
  const lookupPatient = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 14) return;
    setSearchLoading(true);
    try {
      const res = await apiV2.get<PatientLookupResponse>("/patients", {
        params: { NationalId: query.trim() },
      });
      const items = res.data?.data?.items;
      if (res.data?.success && items && items.length > 0) {
        const patient = items[0];
        setFoundPatient(patient);
        caseForm.setValue("NationalId", patient.nationalId);
        goToStep("patient-found", patient.nationalId);
        fetchHistory(query.trim());
      } else {
        setFoundPatient(null);
        patientForm.setValue("nationalId", query.trim());
        caseForm.setValue("NationalId", query.trim());
        goToStep("patient-form", query.trim());
      }
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 404 || status === 400) {
        setFoundPatient(null);
        patientForm.setValue("nationalId", query.trim());
        caseForm.setValue("NationalId", query.trim());
        goToStep("patient-form", query.trim());
      } else {
        toast.error("Search failed. Please try again.");
      }
    } finally {
      setSearchLoading(false);
    }
  }, [patientForm, caseForm, goToStep]);

  // ── History fetch ─────────────────────────────────────────────────────────────
  const fetchHistory = useCallback(async (nationalId: string) => {
    if (!nationalId) return;
    setHistoryLoading(true);
    try {
      const res = await apiV2.get(`/Diagnoses/patient/${nationalId}`, {
        params: { page: 1, pageSize: 10 },
      });
      if (res.data?.success) setHistory(res.data.data.items || []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // ── Create patient ────────────────────────────────────────────────────────────
  const onCreatePatient = async (values: PatientFormValues) => {
    // Generate a random secure password — not exposed to the user
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + "!1";
    try {
      const res = await apiV2.post<PatientCreateResponse>("/patients", {
        ...values,
        password: randomPassword,
        birthDate: new Date(values.birthDate).toISOString(),
        gender: Number(values.gender),
        city: Number(values.city),
      });
      if (res.data?.success && res.data.data) {
        toast.success("Patient created successfully!");
        caseForm.setValue("NationalId", values.nationalId);
        fetchHistory(values.nationalId);
        goToStep("add-case", values.nationalId);
      } else {
        toast.error(res.data?.message || "Failed to create patient");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.errors?.join(", ") ||
        err.response?.data?.message ||
        "Failed to create patient";
      toast.error(msg);
    }
  };

  // ── Create case ───────────────────────────────────────────────────────────────
  const onCreateCase = async (values: CaseFormValues) => {
    const formData = new FormData();
    formData.append("NationalId", values.NationalId);
    formData.append("Description", values.Description);
    formData.append("IsPublic", String(values.IsPublic));
    formData.append("UniversityId", universityId ? universityId : "11111111-1111-1111-1111-111111111111");
    formData.append("CreatedById", createdById);
    formData.append("CreatedByRole", userRole || "Doctor");
    formData.append("InitialDiagnosis.Stage", String(values.InitialDiagnosis.Stage ?? 1));
    if (values.InitialDiagnosis.CaseTypeId)
      formData.append("InitialDiagnosis.CaseTypeId", values.InitialDiagnosis.CaseTypeId);
    if (values.InitialDiagnosis.Notes)
      formData.append("InitialDiagnosis.Notes", values.InitialDiagnosis.Notes);
    (values.InitialDiagnosis.TeethNumbers || []).forEach((t, i) =>
      formData.append(`InitialDiagnosis.TeethNumbers[${i}]`, String(t))
    );
    imageFiles.forEach((file) => formData.append("Images", file));

    try {
      const res = await apiV2.post("/Cases", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        toast.success("Case created successfully!");
        // Reset case form and images so the doctor can add another case for the same patient
        caseForm.reset({
          IsPublic: true,
          NationalId: urlNid,
          InitialDiagnosis: { Stage: 1, TeethNumbers: [], Notes: "", CaseTypeId: "" },
        });
        setImageFiles([]);
        // Re-fetch patient to get updated patientCases, then remount odontogram
        apiV2.get<PatientLookupResponse>("/patients", { params: { NationalId: urlNid } })
          .then((r) => {
            const items = r.data?.data?.items;
            if (items && items.length > 0) setFoundPatient(items[0]);
          })
          .catch(() => { });
        setOdontogramKey((k) => k + 1);
        goToStep("add-case", urlNid);
      } else {
        toast.error(res.data?.message || "Failed to create case");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.errors?.join(", ") ||
        err.response?.data?.message ||
        "Failed to create case";
      toast.error(msg);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Use urlStep as the active step for rendering
  const step = urlStep;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-6 sm:px-6 lg:px-10 lg:py-10 transition-colors duration-300">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="relative rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none p-6 sm:p-8 mb-8 overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 rounded-full bg-linear-to-br from-blue-50 to-indigo-50 dark:from-indigo-500/10 dark:to-blue-500/10 blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 rounded-full bg-linear-to-tr from-violet-50 to-fuchsia-50 dark:from-violet-500/10 dark:to-fuchsia-500/10 blur-3xl opacity-60 pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-600/25 text-white shrink-0">
            <BadgePlus size={24} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {step === "add-case" ? "Add New Case" : "Patient Lookup"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {step === "add-case"
                ? "Fill in the case details for the patient."
                : "Search for a patient by National ID — we'll auto-fill their info."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Step Progress ────────────────────────────────────────────────────── */}
      <StepBar step={step} />

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* STEP 1 — Lookup ─────────────────────────────────────────────────── */}
        {step === "lookup" && (
          <motion.div key="lookup" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}
            className="max-w-xl mx-auto"
          >
            <FormSection icon={Search} title="Search Patient" subtitle="Enter the patient's National ID to look them up">
              <div className="space-y-4">
                <FieldWrap label="National ID">
                  <div className="relative">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      minLength={14}
                      maxLength={14}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); lookupPatient(searchQuery); } }}
                      placeholder="e.g. 30112345678901"
                      autoFocus
                      className={`${inputClass} pr-12`}
                    />
                    {searchLoading && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <Loader2 size={16} className="animate-spin text-indigo-400" />
                      </div>
                    )}
                  </div>
                </FieldWrap>

                <button
                  type="button"
                  onClick={() => lookupPatient(searchQuery)}
                  disabled={searchLoading || searchQuery.trim().length < 14}
                  className="my-btn w-full py-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searchLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Searching...</>
                  ) : (
                    <><Search size={16} className="group-hover:scale-110 transition-transform" /> Search Patient</>
                  )}
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                  <span className="text-xs text-slate-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                </div>

                <button
                  type="button"
                  onClick={() => { patientForm.setValue("nationalId", searchQuery); goToStep("patient-form", searchQuery); }}
                  className="my-btn-outline w-full py-3 group"
                >
                  <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
                  Add New Patient Directly
                </button>
              </div>
            </FormSection>
          </motion.div>
        )}

        {/* STEP 2A — Patient Not Found → Create ──────────────────────────────── */}
        {step === "patient-form" && (
          <motion.div key="patient-form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
            <form onSubmit={patientForm.handleSubmit(onCreatePatient)} noValidate>
              <div className="max-w-2xl mx-auto space-y-6">

                {/* Not found notice */}
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/40 rounded-2xl">
                  <AlertCircle size={16} className="text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    No patient found with National ID. Please fill in their details to register them.
                  </p>
                </motion.div>

                <FormSection icon={UserPlus} title="New Patient Registration" subtitle="Fill in the patient's information" iconColor="from-violet-500 to-purple-600">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <FieldWrap label="Full Name" required error={patientForm.formState.errors.fullName?.message}>
                        <input {...patientForm.register("fullName")} placeholder="Enter Full Name" className={inputClass} />
                      </FieldWrap>
                    </div>

                    {/* National ID */}
                    <FieldWrap label="National ID" required error={patientForm.formState.errors.nationalId?.message}>
                      <input {...patientForm.register("nationalId")} placeholder="Enter National ID" className={inputClass} />
                    </FieldWrap>

                    {/* Phone */}
                    <FieldWrap label="Phone Number" required error={patientForm.formState.errors.phoneNumber?.message}>
                      <input {...patientForm.register("phoneNumber")} placeholder="Enter Phone Number" className={inputClass} />
                    </FieldWrap>

                    {/* Birth Date */}
                    <FieldWrap label="Birth Date" required error={patientForm.formState.errors.birthDate?.message}>
                      <input {...patientForm.register("birthDate")} type="date" className={inputClass} />
                    </FieldWrap>

                    {/* Gender */}
                    <FieldWrap label="Gender" required error={patientForm.formState.errors.gender?.message}>
                      <Controller
                        name="gender"
                        control={patientForm.control}
                        render={({ field }) => (
                          <div className="flex gap-2">
                            {[{ value: 0, label: "Male" }, { value: 1, label: "Female" }].map((g) => (
                              <button key={g.value} type="button"
                                onClick={() => field.onChange(g.value)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${field.value === g.value ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 hover:border-indigo-300"}`}>
                                {g.label}
                              </button>
                            ))}
                          </div>
                        )}
                      />
                    </FieldWrap>

                    {/* City */}
                    <div className="sm:col-span-2">
                      <FieldWrap label="City" required error={patientForm.formState.errors.city?.message}>
                        <Controller
                          name="city"
                          control={patientForm.control}
                          render={({ field }) => (
                            <SelectItems
                              value={Object.keys(cityMap).find((k) => cityMap[k] === field.value) || ""}
                              onChange={(cityName) => field.onChange(cityMap[cityName] ?? 0)}
                              options={cityList}
                              placeholder="Select city..."
                            />
                          )}
                        />
                      </FieldWrap>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button type="button" onClick={() => goToStep("lookup")} className="my-btn-outline px-5 py-2.5">
                      ← Back
                    </button>
                    <button type="submit" disabled={patientForm.formState.isSubmitting}
                      className="my-btn flex-1 py-2.5 group disabled:opacity-60">
                      {patientForm.formState.isSubmitting
                        ? <><Loader2 size={15} className="animate-spin" /> Creating Patient...</>
                        : <><UserPlus size={15} className="group-hover:scale-110 transition-transform" /> Create Patient<ArrowRight size={15} /></>}
                    </button>
                  </div>
                </FormSection>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 2B — Patient Found ────────────────────────────────────────────── */}
        {step === "patient-found" && foundPatient && (
          <motion.div key="patient-found" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
            <div className="max-w-xl mx-auto space-y-4">
              <PatientInfoCard
                patient={foundPatient}
                onContinue={() => goToStep("add-case", urlNid)}
              />
              <button type="button" onClick={() => { setFoundPatient(null); goToStep("lookup"); }}
                className="w-full flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors py-2">
                <RefreshCw size={14} /> Search again
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Add Case ──────────────────────────────────────────────────── */}
        {step === "add-case" && (
          <motion.div key="add-case" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
            <form onSubmit={caseForm.handleSubmit(onCreateCase)} noValidate>
              <div className="space-y-6">

                {/* Patient summary pill */}
                {(foundPatient || patientForm.watch("fullName")) && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/15 border border-indigo-100 dark:border-indigo-800/40 rounded-2xl">
                    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {(foundPatient?.fullName || patientForm.watch("fullName") || "?").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                        {foundPatient?.fullName || patientForm.watch("fullName")}
                      </p>
                      <p className="text-xs text-indigo-500 dark:text-indigo-400">
                        ID: {foundPatient?.nationalId || patientForm.watch("nationalId")}
                      </p>
                    </div>
                    <button type="button" onClick={() => goToStep("lookup")}
                      className="ml-auto text-xs text-indigo-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                      <RefreshCw size={12} /> Change
                    </button>
                  </motion.div>
                )}

                {/* 1. Case Details + Clinical Images — side by side on large screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  <FormSection icon={ClipboardList} title="Case Details" subtitle="Describe the patient's current condition" className="h-full">
                    <div className="space-y-4">
                      <FieldWrap label="Description" required error={caseForm.formState.errors.Description?.message}>
                        <textarea {...caseForm.register("Description")} rows={4} placeholder="Chief complaint: recurring toothache, sensitivity to cold..." className={`${inputClass} resize-none`} />
                      </FieldWrap>

                      {/* IsPublic */}
                      <Controller name="IsPublic" control={caseForm.control} render={({ field }) => (
                        <button type="button" onClick={() => field.onChange(!field.value)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${field.value ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400" : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500"}`}>
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${field.value ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}>
                              {field.value && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-sm font-semibold">{field.value ? "Public Case" : "Private Case"}</span>
                          </div>
                          <span className="text-xs opacity-70">{field.value ? "Visible to all students" : "Restricted"}</span>
                        </button>
                      )} />
                    </div>
                  </FormSection>

                  <FormSection icon={ImageIcon} title="Clinical Images" iconColor="from-rose-500 to-pink-600" className="h-full">
                    <ImageDropzone files={imageFiles} onAdd={(f) => setImageFiles((p) => [...p, ...f])} onRemove={(i) => setImageFiles((p) => p.filter((_, idx) => idx !== i))} />
                  </FormSection>
                </div>

                {/* 3. Initial Diagnosis — Odontogram */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <OdontogramForm
                    key={odontogramKey}
                    history={history}
                    patientCases={foundPatient?.patientCases || []}
                    selectedTeeth={caseForm.watch("InitialDiagnosis.TeethNumbers") || []}
                    onToothSelect={(nums) => {
                      // Only one tooth allowed — take the last selected
                      const single = nums.length > 0 ? [nums[nums.length - 1]] : [];
                      caseForm.setValue("InitialDiagnosis.TeethNumbers", single);
                    }}
                    onToothDataUpdate={(_toothNum, data) => {
                      if (data.caseTypeId) caseForm.setValue("InitialDiagnosis.CaseTypeId", data.caseTypeId);
                      if (data.notes !== undefined) caseForm.setValue("InitialDiagnosis.Notes", data.notes);
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button type="button" onClick={() => goToStep(foundPatient ? "patient-found" : "patient-form", urlNid)} className="my-btn-solid px-5 py-3 group-hover:scale-110 transition-transform"><ChevronLeft size={16} className="group-hover:translate-x-1 transition-transform" /> Back</button>
                  <button type="button" onClick={() => router.push("/cases")} className="my-btn-outline px-5 py-3">Done</button>
                  <button type="submit" disabled={caseForm.formState.isSubmitting} className="my-btn flex-1 py-3 group disabled:opacity-60">
                    {caseForm.formState.isSubmitting
                      ? <><Loader2 size={16} className="animate-spin" /> Creating Case...</>
                      : <><BadgePlus size={16} className="group-hover:scale-110 transition-transform" /> Create Case <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}