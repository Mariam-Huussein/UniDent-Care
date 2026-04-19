"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  GraduationCap,
  IdCard,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Phone,
  AtSign,
} from "lucide-react";

import {
  studentSignupSchema,
  StudentSignupValues,
} from "@/features/auth/schemas/studentSignupSchema";
import { authService } from "@/features/auth/services/authService";
import { StudentSignupPayload } from "@/features/auth/types/studentPayload.Types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { universityService, UniversityLookup } from "@/features/dashboard/services/universityService";

export default function StudentSignup() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [universities, setUniversities] = useState<UniversityLookup[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const isRtl = language === "ar";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentSignupValues>({
    resolver: zodResolver(studentSignupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      phone: "",
      universityId: "",
      level: 1,
      password: "",
    }
  });

  const signupMutation = useMutation({
    mutationFn: (data: StudentSignupPayload) => authService.registerStudent(data),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(isRtl ? "تم إنشاء حساب الطالب! أهلاً بك." : "Student account created! Welcome to the academy.");
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
            ? "فشل التسجيل. يرجى التحقق من المدخلات."
            : "Registration failed. Please check your inputs.");
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

  const onUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("universityId", e.target.value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F9FAFF] dark:bg-slate-950 py-12 px-4 overflow-hidden transition-colors duration-300">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-[100px] opacity-60" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 dark:bg-purple-900/10 rounded-full blur-[100px] opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-6 hover:gap-3 transition-all group`}
        >
          {isRtl ? <ChevronRight size={20} className="group-hover:scale-110 transition-transform" /> : <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" /> }
          {isRtl ? 'رجوع' : 'Back'}
        </button>

        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(79,70,229,0.1)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] border border-indigo-50/50 dark:border-slate-800 p-8 sm:p-12 transition-all duration-300">
          <div className="text-center mb-10">
            <div className="inline-flex relative mb-4">
              <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-20 animate-pulse" />
              <div className="relative w-14 h-14 bg-indigo-600 dark:bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/50">
                <BookOpen size={28} />
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
            onSubmit={handleSubmit((data) => {
              const { grade, ...rest } = data as any; 
              signupMutation.mutate(rest);
            })}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.fullNameLabel}</label>
              <div className="relative group">
                <User className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors`} size={18} />
                <input
                  {...register("fullName")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.fullName ? "border-red-200 dark:border-red-900/50" : "border-slate-50 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder={t.fullNamePlaceholder}
                />
              </div>
              {errors.fullName && <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>{errors.fullName.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>University Email</label>
              <div className="relative group">
                <Mail className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors`} size={18} />
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.email ? "border-red-200 dark:border-red-900/50" : "border-slate-50 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder="student@university.edu"
                  dir="ltr"
                />
              </div>
              {errors.email && <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>{errors.email.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>Username</label>
              <div className="relative group">
                <AtSign className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors`} size={18} />
                <input
                  {...register("username")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.username ? "border-red-200 dark:border-red-900/50" : "border-slate-50 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder="johndoe123"
                  dir="ltr"
                />
              </div>
              {errors.username && <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>{errors.username.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.phoneLabel}</label>
              <div className="relative group">
                <Phone className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors`} size={18} />
                <input
                  {...register("phone")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.phone ? "border-red-200 dark:border-red-900/50" : "border-slate-50 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder="01XXXXXXXXX"
                  dir="ltr"
                />
              </div>
              {errors.phone && <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>{errors.phone.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5 md:col-span-2">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>University</label>
              <div className="relative group">
                <BookOpen className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors`} size={18} />
                <select
                  {...register("universityId")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.universityId ? "border-red-200 dark:border-red-900/50" : "border-slate-50 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 appearance-none`}
                  disabled={isLoadingUniversities}
                  defaultValue=""
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

            <motion.div variants={itemVariants} className="space-y-1.5 md:col-span-2">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.levelLabel}</label>
              <div className="relative group">
                <GraduationCap className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors`} size={18} />
                <input
                  type="number"
                  {...register("level", { valueAsNumber: true })}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.level ? "border-red-200 dark:border-red-900/50" : "border-slate-50 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400"} rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder="Level (1-7)"
                  dir="ltr"
                />
              </div>
              {errors.level && <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>{errors.level.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5 md:col-span-2">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.passwordLabel}</label>
              <div className="relative group">
                <Lock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors`} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.password ? "border-red-200 dark:border-red-900/50" : "border-slate-50 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400"} rounded-2xl px-11 py-3.5 outline-none transition-all focus:bg-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className={`text-[11px] font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>{errors.password.message}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="group relative w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-[1.25rem] font-bold text-lg transition-all duration-300 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:shadow-2xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 active:scale-[0.98] disabled:opacity-70"
              >
                <div className="flex items-center justify-center gap-2">
                  {signupMutation.isPending ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <>
                      <span>{t.createAccountTitle}</span>
                      <ArrowRight size={20} className={`group-hover:${isRtl ? '-translate-x-1' : 'translate-x-1'} transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </div>
              </button>
            </motion.div>
          </motion.form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              {isRtl ? 'لديك حساب بالفعل؟' : 'Already a member?'}{" "}
              <a href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline decoration-2 underline-offset-4">{isRtl ? 'سجل دخولك' : 'Log in here'}</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}