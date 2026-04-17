"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Phone,
  Fingerprint,
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
} from "lucide-react";

import {
  patientSignupSchema,
  PatientSignupValues,
} from "@/features/auth/schemas/patientSignupSchema";
import { authService } from "@/features/auth/services/authService";
import { FaVenusMars } from "react-icons/fa";
import Logo from "@/components/ui/Logo";
import { useLanguage } from "@/components/providers/LanguageProvider";
import SearchableSelect from "@/components/common/SearchableSelect";

export default function PatientSignup() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const isRtl = language === "ar";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PatientSignupValues>({
    resolver: zodResolver(patientSignupSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      password: "",
      phoneNumber: "",
      nationalId: "",
      birthDate: "",
      gender: 0,
      city: 0,
    },
  });
  
  const { data: cities, isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities-lookup"],
    queryFn: authService.getCitiesLookup,
  });

  const signupMutation = useMutation({
    mutationFn: authService.registerPatient,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(isRtl ? "تم إنشاء الحساب بنجاح!" : "Account created successfully!");
        router.push("/login");
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || (isRtl ? "حدث خطأ ما" : "Something went wrong");
      toast.error(msg);
    },
  });

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

  const onSubmit = (data: PatientSignupValues) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-950 py-12 px-4 overflow-hidden transition-colors duration-300">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl z-10">
        <button onClick={() => router.back()} className={`flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mb-6 hover:${isRtl ? 'translate-x-1' : '-translate-x-1'} transition-transform`}>
          {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />} {isRtl ? 'رجوع' : 'Back'}
        </button>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white dark:border-slate-800 p-8 sm:p-12 transition-all duration-300">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="mb-4 w-full flex justify-center">
              <Logo 
                showText={false}
                iconClassName="w-16 sm:w-20 mb-1" 
                className="flex-col gap-2"
              />
            </div>
            <h2 className={`mt-2 text-2xl font-black text-slate-800 dark:text-slate-200 ${isRtl ? 'font-arabic' : ''}`}>
              {t.createAccountTitle}
            </h2>
          </div>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5"
          >
            
            {/* Full Name */}
            <motion.div variants={itemVariants} className="md:col-span-2 space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.fullNameLabel}</label>
              <div className="relative">
                <User className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500`} size={18} />
                <input
                  {...register("fullName")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 border-slate-50 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder={t.fullNamePlaceholder}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 dark:text-red-400 font-bold">{errors.fullName.message}</p>}
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.passwordLabel}</label>
              <div className="relative">
                <Lock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500`} size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 border-slate-50 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 rounded-2xl ${isRtl ? 'pr-11 pl-12' : 'pl-11 pr-12'} py-3 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder={t.passwordPlaceholder}
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500`}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 dark:text-red-400 font-bold">{errors.password.message}</p>}
            </motion.div>

            {/* Phone */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.phoneLabel}</label>
              <div className="relative">
                <Phone className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500`} size={18} />
                <input
                  {...register("phoneNumber")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 border-slate-50 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder={t.phonePlaceholder}
                  dir="ltr"
                />
              </div>
              {errors.phoneNumber && <p className="text-xs text-red-500 dark:text-red-400 font-bold">{errors.phoneNumber.message}</p>}
            </motion.div>

            {/* National ID */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.nationalIdLabel}</label>
              <div className="relative">
                <Fingerprint className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500`} size={18} />
                <input
                  {...register("nationalId")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 border-slate-50 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder={t.nationalIdPlaceholder}
                  dir="ltr"
                />
              </div>
              {errors.nationalId && <p className="text-xs text-red-500 dark:text-red-400 font-bold">{errors.nationalId.message}</p>}
            </motion.div>

            {/* Birth Date */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.dobLabel}</label>
              <div className="relative">
                <Calendar className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10`} size={18} />
                <input
                  type="date"
                  {...register("birthDate")}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 border-slate-50 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none transition-all`}
                />
              </div>
              {errors.birthDate && <p className="text-xs text-red-500 dark:text-red-400 font-bold">{errors.birthDate.message}</p>}
            </motion.div>

            {/* Gender */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.genderLabel}</label>
              <div className="relative">
                <FaVenusMars className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500`} size={18} />
                <select
                  {...register("gender", { valueAsNumber: true })}
                  className={`w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-2 border-slate-50 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500 rounded-2xl ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 outline-none appearance-none cursor-pointer`}
                >
                  <option value={0}>{t.genderMale}</option>
                  <option value={1}>{t.genderFemale}</option>
                </select>
              </div>
            </motion.div>

            {/* City */}
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>{t.cityLabel}</label>
              <div className="relative group">
                <MapPin className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-20`} size={18} />
                <SearchableSelect
                  options={cities?.map(city => ({ id: city.id, label: isRtl ? city.name_ar : city.name_en })) || []}
                  value={watch("city")}
                  onChange={(id) => setValue("city", id as number)}
                  placeholder={t.citySelect}
                  searchPlaceholder={isRtl ? "ابحث عن المدينة..." : "Search for city..."}
                  isRtl={isRtl}
                  error={errors.city?.message}
                  accentColor="blue"
                />
              </div>
              {errors.city && <p className="text-xs text-red-500 dark:text-red-400 font-bold">{errors.city.message}</p>}
              {isLoadingCities && <p className="text-[10px] text-blue-500 animate-pulse px-2">Loading cities...</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {signupMutation.isPending ? <Loader2 className="animate-spin" /> : 
                <>
                  {t.createAccountTitle}
                  <ArrowRight size={20} className={`${isRtl ? 'rotate-180' : ''}`} />
                </>}
              </button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}