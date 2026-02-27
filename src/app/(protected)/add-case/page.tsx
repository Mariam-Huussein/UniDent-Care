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
import {
  createCase,
} from "@/features/cases/services/caseService";
import { getCaseTypes } from "@/server/caseTypes.action";
import { CaseType } from "@/features/cases/types/case.types";
import Cookies from "js-cookie";

export default function AddCase() {
  const patientId = useSelector((state: RootState) => state.auth.user?.publicId) || Cookies.get("user_id");
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
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
      setCaseTypes(((res as any).data?.items || (res as any).items || []).map((item: any) => ({
        id: item.publicId,
        name: item.name,
      })));
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
    const toastId = toast.loading("Finalizing your request...");
    try {
      const res = await createCase(values);
      if (res.data?.success) {
        toast.success("Case submitted perfectly!", { id: toastId });
        form.reset({
          Title: "",
          Description: "",
          CaseTypeId: "",
          Images: [],
        });
        setSelectedTypeName("");
        setImages([]);
      } else {
        toast.error(res.data?.message || "Error creating case", {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred", { id: toastId });
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      console.log("Current patientId value:", patientId);
    }
  }, [errors, patientId]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#FDFDFF] p-6 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-[120px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl"
      >
        <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden backdrop-blur-sm">
          <div className="h-2 w-full bg-linear-to-r from-blue-500 via-indigo-600 to-purple-500" />

          <div className="pt-10 pb-6 text-center">
            <div className="inline-flex relative mb-4">
              <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-20 animate-pulse" />
              <div className="relative w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <ClipboardPlus size={28} />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Create Medical Case
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Get the right diagnosis by filling the details
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-8 pb-10 space-y-6"
          >
            <div className="group space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                <FileText
                  size={14}
                  className="group-focus-within:text-indigo-600 transition-colors"
                />
                Case Subject
              </label>
              <input
                {...register("Title")}
                placeholder="Brief name for your condition"
                className={`w-full bg-slate-50 border-2 ${errors.Title ? "border-red-200" : "border-slate-50 focus:border-indigo-500"} rounded-2xl px-5 py-3.5 outline-none transition-all duration-300 placeholder:text-slate-400 font-medium focus:bg-white focus:shadow-sm`}
              />
              <AnimatePresence>
                {errors.Title && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-semibold text-red-500 flex items-center gap-1 ml-1"
                  >
                    <AlertCircle size={12} /> {errors.Title.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2" ref={dropdownRef}>
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                <Stethoscope size={14} className="text-indigo-600" />
                Medical Specialty
              </label>
              <div className="relative">
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className={`w-full flex items-center justify-between bg-slate-50 border-2 cursor-pointer transition-all duration-300 ${isOpen ? "border-indigo-500 bg-white ring-4 ring-indigo-50" : "border-slate-50"} rounded-2xl px-5 py-3.5`}
                >
                  <span
                    className={`font-semibold ${selectedTypeName ? "text-slate-800" : "text-slate-400"}`}
                  >
                    {selectedTypeName || "Select Specialty..."}
                  </span>
                  <ChevronDown
                    className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    size={18}
                  />
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute z-50 w-full mt-3 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden"
                    >
                      <div className="p-3 bg-slate-50/50 border-b border-slate-100">
                        <div className="relative flex items-center">
                          <Search
                            className="absolute left-3 text-slate-400"
                            size={14}
                          />
                          <input
                            autoFocus
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Filter specialties..."
                            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 ring-indigo-500/20"
                          />
                        </div>
                      </div>
                      <div className="max-h-52 overflow-y-auto p-2 custom-scrollbar">
                        {isLoadingTypes ? (
                          <div className="py-10 flex flex-col items-center gap-2 text-slate-400">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="text-xs font-medium tracking-tight">
                              Updating List...
                            </span>
                          </div>
                        ) : (
                          caseTypes.map((type) => (
                            <div
                              key={type.id}
                              onClick={() => handleSelectType(type)}
                              className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all mb-1 ${currentCaseTypeId === type.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "hover:bg-indigo-50 text-slate-600"}`}
                            >
                              <span className="font-bold text-sm tracking-tight">
                                {type.name}
                              </span>
                              {currentCaseTypeId === type.id && (
                                <Check size={16} />
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
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs font-semibold text-red-500 flex items-center gap-1 mt-2 ml-1 absolute -bottom-6"
                    >
                      <AlertCircle size={12} /> {errors.CaseTypeId.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                <Sparkles size={14} className="text-amber-500" />
                Symptom Details
              </label>
              <textarea
                {...register("Description")}
                placeholder="Describe your pain, duration, and any relevant info..."
                className={`w-full min-h-[140px] bg-slate-50 border-2 ${errors.Description ? "border-red-200" : "border-slate-50 focus:border-indigo-500"} focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all duration-300 resize-none font-medium placeholder:text-slate-400 focus:shadow-sm`}
              />
              <AnimatePresence>
                {errors.Description && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-semibold text-red-500 flex items-center gap-1 ml-1"
                  >
                    <AlertCircle size={12} /> {errors.Description.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                <ImageIcon size={14} className="text-blue-500" />
                Case Images
              </label>

              <label
                htmlFor="fileInput"
                className="w-full bg-slate-50 border-2 border-slate-50 hover:border-indigo-400 border-dashed rounded-2xl px-5 py-8 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 group"
              >
                <div className="p-3 bg-indigo-100/50 rounded-full group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.665 3.667H11a3.667 3.667 0 0 0-3.667 3.666v29.334A3.667 3.667 0 0 0 11 40.333h22a3.667 3.667 0 0 0 3.666-3.666v-22m-11-11 11 11m-11-11v11h11m-7.333 9.166H14.665m14.667 7.334H14.665M18.332 16.5h-3.667" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-slate-600 font-medium">Drag & drop your files here</p>
                  <p className="text-slate-400 text-sm mt-1">Or <span className="text-indigo-600 font-semibold hover:underline">click</span> to upload</p>
                </div>
                <input id="fileInput" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {images.map((file, idx) => (
                    <div key={idx} className="relative flex items-center justify-between p-3 bg-white border border-slate-200 shadow-sm rounded-xl">
                      <div className="flex-1 truncate text-xs font-semibold text-slate-600 mr-2" title={file.name}>
                        {file.name}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <AnimatePresence>
                {errors.Images && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-semibold text-red-500 flex items-center gap-1 ml-1"
                  >
                    <AlertCircle size={12} /> {String(errors.Images.message)}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full group overflow-hidden bg-slate-900 text-white py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-200 active:scale-[0.97] disabled:opacity-50 cursor-pointer"
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Submit Request</span>
                    <CheckCircle2
                      size={18}
                      className="group-hover:rotate-12 transition-transform"
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
