"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Stethoscope,
  IdCard,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  AtSign,
  BookOpen,
} from "lucide-react";

import {
  doctorSignupSchema,
  DoctorSignupValues,
} from "@/features/auth/schemas/doctorSignupSchema";
import { authService } from "@/features/auth/services/authService";
import { FaTooth } from "react-icons/fa";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { universityService, UniversityLookup } from "@/features/dashboard/services/universityService";

export default function DoctorSignup() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [universities, setUniversities] = useState<UniversityLookup[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const isRtl = language === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorSignupValues>({
    resolver: zodResolver(doctorSignupSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      specialty: "",
      universityId: "",
      password: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: authService.registerDoctor,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(isRtl ? "تم إنشاء حساب الطبيب بنجاح!" : "Doctor account created successfully!");
        router.push("/login");
      }
    },
    onError: (err: any) => {
      const apiError = err?.response?.data;
      const serverErrors = apiError?.errors || apiError?.error?.errors;

      if (serverErrors) {
        if (typeof serverErrors === "object" && !Array.isArray(serverErrors)) {
          Object.keys(serverErrors).forEach((key) => {
            const messages = serverErrors[key];
            if (Array.isArray(messages)) {
              messages.forEach((msg: string) => toast.error(`${key}: ${msg}`));
            } else {
              toast.error(`${key}: ${messages}`);
            }
          });
        } else if (Array.isArray(serverErrors)) {
          serverErrors.forEach((msg: any) => {
            if (typeof msg === "string") toast.error(msg);
            else if (typeof msg === "object") toast.error(JSON.stringify(msg));
          });
        } else {
          toast.error(String(serverErrors));
        }
      } else {
        const msg =
          apiError?.message ||
          (isRtl
            ? "فشل التسجيل. يرجى التحقق من بياناتك."
            : "Registration failed. Please check your data.");
        toast.error(msg);
      }
    },
  });

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await universityService.getUniversitiesLookup();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to fetch universities", error);
      } finally {
        setIsLoadingUniversities(false);
      }
    };
    fetchUniversities();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F4F9F9] dark:bg-slate-950 py-12 px-4 overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-100/40 dark:bg-teal-900/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl z-10"
      >
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold mb-6 hover:${isRtl ? 'translate-x-[4px]' : 'translate-x-[-4px]'} transition-transform group`}
        >
          <div className="p-1 rounded-full group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30">
            {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </div>
          {isRtl ? 'رجوع' : 'Back'}
        </button>

        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(20,80,80,0.1)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white dark:border-slate-800 p-8 sm:p-12 transition-all duration-300">
          <div className="text-center mb-10">
            <div className="inline-flex relative mb-4 mt-2">
              <div className="absolute inset-0 bg-teal-400 blur-xl opacity-20 animate-pulse" />
              <div className="relative w-14 h-14 bg-teal-600 dark:bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-100 dark:shadow-teal-900/50">
                <FaTooth size={28} />
              </div>
            </div>
            <h2 className={`text-3xl font-black text-slate-900 dark:text-white tracking-tight ${isRtl ? 'font-arabic' : ''}`}>
              {t.createAccountTitle}
            </h2>
          </div>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit((data) => signupMutation.mutate(data))}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                {t.fullNameLabel}
              </label>
              <div className="relative group">
                <User
                  className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors`}
                  size={18}
                />
                <input
                  {...register("fullName")}
                  className={`w-full bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.fullName ? "border-red-200 dark:border-red-900/50" : "border-slate-100 dark:border-slate-800 focus:border-teal-500 dark:focus:border-teal-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder="Dr. Ahmed Ali"
                />
              </div>
              {errors.fullName && (
                <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                  {errors.fullName.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                Username
              </label>
              <div className="relative group">
                <AtSign
                  className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors`}
                  size={18}
                />
                <input
                  {...register("username")}
                  className={`w-full bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.username ? "border-red-200 dark:border-red-900/50" : "border-slate-100 dark:border-slate-800 focus:border-teal-500 dark:focus:border-teal-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder="ahmed_dentist"
                  dir="ltr"
                />
              </div>
              {errors.username && (
                <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                  {errors.username.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                Email
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors`}
                  size={18}
                />
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.email ? "border-red-200 dark:border-red-900/50" : "border-slate-100 dark:border-slate-800 focus:border-teal-500 dark:focus:border-teal-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder="doctor@example.com"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                {t.phoneLabel}
              </label>
              <div className="relative group">
                <Phone
                  className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors`}
                  size={18}
                />
                <input
                  {...register("phone")}
                  className={`w-full bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.phone ? "border-red-200 dark:border-red-900/50" : "border-slate-100 dark:border-slate-800 focus:border-teal-500 dark:focus:border-teal-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder={t.phonePlaceholder}
                  dir="ltr"
                />
              </div>
              {errors.phone && (
                <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                  {errors.phone.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                {t.specialtyLabel}
              </label>
              <div className="relative group">
                <Stethoscope
                  className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors`}
                  size={18}
                />
                <input
                  {...register("specialty")}
                  className={`w-full bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.specialty ? "border-red-200 dark:border-red-900/50" : "border-slate-100 dark:border-slate-800 focus:border-teal-500 dark:focus:border-teal-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder="e.g. Endodontics"
                />
              </div>
              {errors.specialty && (
                <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                  {errors.specialty.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                {t.universityIdLabel}
              </label>
              <div className="relative group">
                <IdCard
                  className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors`}
                  size={18}
                />
                <select
                  {...register("universityId")}
                  className={`w-full bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.universityId ? "border-red-200 dark:border-red-900/50" : "border-slate-100 dark:border-slate-800 focus:border-teal-500 dark:focus:border-teal-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 appearance-none`}
                  dir="ltr"
                  disabled={isLoadingUniversities}
                >
                  <option value="" disabled>{isLoadingUniversities ? "Loading..." : "Select University"}</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>{uni.name}</option>
                  ))}
                </select>
                <div className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 pointer-events-none text-slate-400`}>
                  <ArrowRight size={16} className="rotate-90" />
                </div>
              </div>
              {errors.universityId && (
                <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                  {errors.universityId.message}
                </p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="space-y-2 md:col-span-2"
            >
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                {t.passwordLabel}
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors`}
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.password ? "border-red-200 dark:border-red-900/50" : "border-slate-100 dark:border-slate-800 focus:border-teal-500 dark:focus:border-teal-400"} rounded-2xl px-11 py-3 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="group relative w-full bg-slate-900 dark:bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-teal-600 dark:hover:bg-teal-500 hover:shadow-2xl hover:shadow-teal-200 dark:hover:shadow-teal-900/30 active:scale-[0.98] disabled:opacity-70"
              >
                <div className="flex items-center justify-center gap-2">
                  {signupMutation.isPending ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <>
                      <span>{t.createAccountTitle}</span>
                      <ArrowRight
                        size={20}
                        className={`group-hover:${isRtl ? '-translate-x-1' : 'translate-x-1'} transition-transform ${isRtl ? 'rotate-180' : ''}`}
                      />
                    </>
                  )}
                </div>
              </button>
            </motion.div>
          </motion.form>

          <p className="mt-8 text-center text-slate-500 dark:text-slate-400 font-medium text-sm">
            {isRtl ? 'لديك حساب بالفعل؟' : 'Already a member?'}{" "}
            <a
              href="/login"
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
            >
              {isRtl ? 'سجل دخولك' : 'Log in here'}
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
