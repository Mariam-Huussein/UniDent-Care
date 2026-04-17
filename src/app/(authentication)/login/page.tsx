"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

import {
  loginSchema,
  LoginFormValues,
} from "@/features/auth/schemas/loginSchema";
import {
  authService,
  getProfileByRole,
} from "@/features/auth/services/authService";
import { login, setUserFromReload } from "@/features/auth/store/authSlice";
import { LoginResponse } from "@/features/auth/types";
import Logo from "@/components/ui/Logo";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const isRtl = language === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (response: LoginResponse) => {
      const { token, roles, publicId } = response.data;

      if (response.success && token && roles) {
        dispatch(login(response.data));

        try {
          const user = await getProfileByRole(roles[0], publicId);
          dispatch(setUserFromReload({ user, role: roles[0] }));
        } catch (err: any) {
          console.error(err);
          // Silent gracefully
        }
        router.replace("/dashboard");
        toast.success(isRtl ? "مرحباً بك مرة أخرى!" : "Welcome back!");
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || (isRtl ? "بيانات غير صحيحة" : "Invalid credentials");
      toast.error(msg);
    },
  });

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate(data);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden px-4 transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 dark:bg-indigo-900/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[450px]"
      >
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white dark:border-slate-800 p-8 sm:p-12 transition-all duration-300">
          <div className="text-center mb-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <Logo 
                iconClassName="w-16 sm:w-24" 
                textClassName="text-3xl sm:text-4xl" 
                className="flex-col gap-2"
              />
            </motion.div>

            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium italic">
              {t.loginSubtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-sm font-bold text-slate-700 dark:text-slate-300 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                {t.emailLabel}
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors`}
                  size={20}
                />
                <input
                  type="text"
                  {...register("email")}
                  className={`w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.email ? "border-red-100 dark:border-red-900/50" : "border-slate-100 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500"} rounded-2xl ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 outline-none transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder={t.emailPlaceholder}
                />
              </div>
              {errors.email && (
                <p className={`text-xs font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className={`flex justify-between items-center ${isRtl ? 'mr-1' : 'ml-1'}`}>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {t.passwordLabel}
                </label>
                <a
                  href="/forget-password"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  {t.forgotPassword}
                </a>
              </div>
              <div className="relative group">
                <Lock
                  className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors`}
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.password ? "border-red-100 dark:border-red-900/50" : "border-slate-100 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500"} rounded-2xl px-12 py-3.5 outline-none transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder={t.passwordPlaceholder}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className={`text-xs font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-200 dark:hover:shadow-blue-900/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loginMutation.isPending ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <>
                    <span>{t.signInBtn}</span>
                    <ArrowRight
                      size={20}
                      className={`group-hover:${isRtl ? '-translate-x-1' : 'translate-x-1'} transition-transform ${isRtl ? 'rotate-180' : ''}`}
                    />
                  </>
                )}
              </div>
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 dark:text-slate-400 font-medium text-sm">
            {t.noAccount}{" "}
            <a
              href="/signup/patient"
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              {t.createOne}
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
