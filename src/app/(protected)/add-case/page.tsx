"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardPlus,
  FileText,
  Stethoscope,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Search,
  ChevronDown,
  X,
  Check,
  Sparkles,
  ImageIcon,
} from "lucide-react";

import { RootState } from "@/store";
import {
  addCaseSchema,
  AddCaseFormValues,
} from "@/features/cases/schemas/addCaseSchema";
import { createCase } from "@/features/cases/services/caseService";
import { getCaseTypes } from "@/server/caseTypes.action";
import { CaseType } from "@/features/cases/types/case.types";
import Cookies from "js-cookie";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AddCase() {
  const patientId = useSelector((state: RootState) => state.auth.user?.publicId) || Cookies.get("user_id");
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [caseTypes, setCaseTypes] = useState<CaseType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [selectedTypeName, setSelectedTypeName] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...images, ...newFiles];
      setImages(updatedFiles);
      setValue("Images", updatedFiles, { shouldValidate: true });
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedFiles = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedFiles);
    setValue("Images", updatedFiles, { shouldValidate: true });
  };

  const form = useForm<AddCaseFormValues>({
    resolver: zodResolver(addCaseSchema),
    defaultValues: { PatientId: patientId },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const currentCaseTypeId = watch("CaseTypeId");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeOut);
  }, [search]);

  useEffect(() => {
    if (patientId) setValue("PatientId", patientId);
  }, [patientId, setValue]);

  useEffect(() => {
    loadCaseTypes(debouncedSearch);
  }, [debouncedSearch]);

  const loadCaseTypes = async (searchValue?: string) => {
    try {
      setIsLoadingTypes(true);
      const res = await getCaseTypes(1, 20, searchValue);
      setCaseTypes(
        ((res as any).data?.items || (res as any).items || []).map(
           (item: any) => ({
            id: item.publicId,
            name: isRtl && item.nameArabic ? item.nameArabic : item.name,
          })
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const handleSelectType = (type: CaseType) => {
    setValue("CaseTypeId", type.id, { shouldValidate: true });
    setSelectedTypeName(type.name);
    setIsOpen(false);
    setSearch("");
  };

  const onSubmit = async (values: AddCaseFormValues) => {
    const toastId = toast.loading(t.addCaseSubmitting);
    try {
      const res = await createCase(values);
      if (res.data?.success) {
        toast.success(t.addCaseSuccess, { id: toastId });
        form.reset({
          Title: "",
          Description: "",
          CaseTypeId: "",
          Images: [],
        });
        setSelectedTypeName("");
        setImages([]);
      } else {
        toast.error(res.data?.message || t.addCaseErrorCreation, {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(t.addCaseErrorUnexpected, { id: toastId });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-2xl mx-auto"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/40 dark:border-slate-800/60 backdrop-blur-xl overflow-hidden">
          <div className="h-1.5 w-full bg-linear-to-r from-blue-500 via-indigo-600 to-purple-500" />

          <div className="pt-10 pb-6 px-6 sm:px-10 text-center">
            <div className="inline-flex relative mb-5 group">
              <div className="absolute inset-0 bg-indigo-400 dark:bg-indigo-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-full" />
              <div className="relative w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 transform group-hover:-translate-y-1 transition-transform duration-300 rotate-3 group-hover:rotate-6">
                <ClipboardPlus size={32} />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              {t.addCaseTitle}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-2 font-medium">
              {t.addCaseDesc}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 sm:px-10 pb-10 space-y-6 sm:space-y-7"
          >
            {/* Subject */}
            <div className="group space-y-2.5">
              <label className={`flex items-center gap-2 text-xs sm:text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${isRtl ? 'mr-1' : 'ml-1'}`}>
                <FileText
                  size={16}
                  className="text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors"
                />
                {t.addCaseSubject}
              </label>
              <input
                {...register("Title")}
                placeholder={t.addCaseSubjectPlaceholder}
                className={`w-full bg-slate-50/50 dark:bg-slate-950/50 border-2 ${errors.Title ? "border-red-300 dark:border-red-500/50 focus:border-red-500" : "border-slate-100 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500/50"} rounded-2xl px-5 py-3.5 sm:py-4 outline-none transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:focus:shadow-[0_8px_30px_rgb(0,0,0,0.2)]`}
              />
              <AnimatePresence>
                {errors.Title && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`text-xs font-bold text-red-500 dark:text-red-400 flex items-center gap-1.5 mt-1.5 ${isRtl ? 'mr-2' : 'ml-2'}`}
                  >
                    <AlertCircle size={14} /> {errors.Title.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Specialty */}
            <div className="space-y-2.5 relative" ref={dropdownRef}>
              <label className={`flex items-center gap-2 text-xs sm:text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${isRtl ? 'mr-1' : 'ml-1'}`}>
                <Stethoscope size={16} className="text-indigo-500 dark:text-indigo-400" />
                {t.addCaseSpecialty}
              </label>
              <div className="relative">
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className={`w-full flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50 border-2 cursor-pointer transition-all duration-300 ${isOpen ? "border-indigo-500 dark:border-indigo-500/50 bg-white dark:bg-slate-900 ring-4 ring-indigo-50 dark:ring-indigo-900/20" : "border-slate-100 dark:border-slate-800"} rounded-2xl px-5 py-3.5 sm:py-4`}
                >
                  <span
                    className={`font-bold ${selectedTypeName ? "text-slate-800 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}
                  >
                    {selectedTypeName || t.addCaseSpecialtyPlaceholder}
                  </span>
                  <ChevronDown
                    className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-500" : ""}`}
                    size={20}
                  />
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 w-full mt-3 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-800 overflow-hidden"
                    >
                      <div className="p-3 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative flex items-center">
                          <Search
                            className={`absolute ${isRtl ? 'right-4' : 'left-4'} text-slate-400 dark:text-slate-500`}
                            size={16}
                          />
                          <input
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t.addCaseSpecialtyFilter}
                            className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-sm outline-none focus:ring-2 ring-indigo-500/20 dark:ring-indigo-500/40 text-slate-800 dark:text-white font-medium ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
                        {isLoadingTypes ? (
                          <div className="py-12 flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                            <Loader2 className="animate-spin" size={24} />
                            <span className="text-sm font-bold tracking-tight">
                              {t.addCaseSpecialtyUpdating}
                            </span>
                          </div>
                        ) : (
                          caseTypes.map((type) => (
                            <div
                              key={type.id}
                              onClick={() => handleSelectType(type)}
                              className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all mb-1 ${currentCaseTypeId === type.id ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/50" : "hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
                            >
                              <span className="font-bold text-sm tracking-tight">
                                {type.name}
                              </span>
                              {currentCaseTypeId === type.id && (
                                <Check size={18} strokeWidth={3} />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {errors.CaseTypeId && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className={`text-xs font-bold text-red-500 dark:text-red-400 flex items-center gap-1.5 mt-2 absolute -bottom-7 ${isRtl ? 'mr-2' : 'ml-2'}`}
                    >
                      <AlertCircle size={14} /> {errors.CaseTypeId.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Symptoms / Description */}
            <div className="space-y-2.5">
              <label className={`flex items-center gap-2 text-xs sm:text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${isRtl ? 'mr-1' : 'ml-1'}`}>
                <Sparkles size={16} className="text-amber-500" />
                {t.addCaseSymptoms}
              </label>
              <textarea
                {...register("Description")}
                placeholder={t.addCaseSymptomsPlaceholder}
                className={`w-full min-h-[160px] bg-slate-50/50 dark:bg-slate-950/50 border-2 ${errors.Description ? "border-red-300 dark:border-red-500/50 focus:border-red-500" : "border-slate-100 dark:border-slate-800 focus:border-amber-400 dark:focus:border-amber-500/50"} focus:bg-white dark:focus:bg-slate-900 rounded-2xl px-5 py-4 outline-none transition-all duration-300 resize-none font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-800 dark:text-white focus:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:focus:shadow-[0_8px_30px_rgb(0,0,0,0.2)]`}
              />
              <AnimatePresence>
                {errors.Description && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`text-xs font-bold text-red-500 dark:text-red-400 flex items-center gap-1.5 mt-1.5 ${isRtl ? 'mr-2' : 'ml-2'}`}
                  >
                    <AlertCircle size={14} /> {errors.Description.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Images */}
            <div className="space-y-2.5">
              <label className={`flex items-center gap-2 text-xs sm:text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${isRtl ? 'mr-1' : 'ml-1'}`}>
                <ImageIcon size={16} className="text-blue-500" />
                {t.addCaseImages}
              </label>

              <label
                htmlFor="fileInput"
                className="w-full bg-slate-50/50 dark:bg-slate-900/40 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500/60 border-dashed rounded-3xl px-5 py-10 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 group hover:bg-slate-50 dark:hover:bg-slate-900/80"
              >
                <div className="p-4 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-full group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-all duration-300 shadow-sm text-indigo-600 dark:text-indigo-400">
                  <ClipboardPlus size={32} strokeWidth={2} />
                </div>
                <div className="text-center">
                  <p className="text-slate-700 dark:text-slate-300 font-bold text-base">
                    {t.addCaseImagesDrag}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1.5 font-medium">
                    {t.addCaseImagesOr}{" "}
                    <span className="text-indigo-600 dark:text-indigo-400 font-black hover:underline cursor-pointer">
                      {t.addCaseImagesClick}
                    </span>{" "}
                    {t.addCaseImagesUpload}
                  </p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {images.map((file, idx) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={idx}
                      className="relative flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div
                        className="relative z-10 flex-1 truncate text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mx-2"
                        title={file.name}
                      >
                        {file.name}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="relative z-10 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
              <AnimatePresence>
                {errors.Images && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`text-xs font-bold text-red-500 dark:text-red-400 flex items-center gap-1.5 mt-1.5 ${isRtl ? 'mr-2' : 'ml-2'}`}
                  >
                    <AlertCircle size={14} /> {String(errors.Images.message)}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full group overflow-hidden bg-slate-900 dark:bg-indigo-600 text-white py-4 sm:py-5 rounded-2xl font-black text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 cursor-pointer border border-transparent dark:border-indigo-500/50"
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 dark:group-hover:opacity-0 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-blue-500 opacity-0 dark:opacity-0 dark:group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>{t.addCaseSubmitting}</span>
                  </>
                ) : (
                  <>
                    <span>{t.addCaseSubmit}</span>
                    <CheckCircle2
                      size={20}
                      className="group-hover:scale-110 group-hover:rotate-12 transition-transform"
                      strokeWidth={2.5}
                    />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
