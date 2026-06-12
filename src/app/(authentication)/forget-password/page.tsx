"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useLanguage } from "@/components/providers/LanguageProvider";

import {
  forgetPasswordSchema,
  ForgetPasswordValues,
} from "@/features/auth/schemas/forgetPasswordSchema";
import { authService } from "@/features/auth/services/authService";

export default function ForgetPassword() {
  const { t, language } = useLanguage();
  const isRtl = language === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordValues>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const forgetMutation = useMutation({
    mutationFn: (data: ForgetPasswordValues) =>
      authService.forgotPassword(data.email),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Reset link sent to your email!");
      } else {
        toast.error(response.message || "Something went wrong");
      }
    },
    onError: (error: any) => {
      // Extract error message from the response structure
      const errorData = error?.response?.data;
      let msg = "Error sending email";
      
      if (errorData) {
        // Check if error message is in error.errors array
        if (errorData.error?.errors?.[0]) {
          msg = errorData.error.errors[0];
        } 
        // Fallback to root message field
        else if (errorData.message && errorData.message !== "Error") {
          msg = errorData.message;
        }
      }
      toast.error(msg);
    },
  });

  const onSubmit = (data: ForgetPasswordValues) => {
    forgetMutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden px-4 transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 dark:bg-indigo-900/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-112.5"
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

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-4">
              {t.forgotPasswordTitle}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
              {t.forgotPasswordDesc}
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
                  type="email"
                  {...register("email")}
                  className={`w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-2 ${errors.email ? "border-red-100 dark:border-red-900/50" : "border-slate-100 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-500"} rounded-2xl ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 outline-none transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600`}
                  placeholder={t.emailPlaceholder}
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className={`text-xs font-bold text-red-500 dark:text-red-400 ${isRtl ? 'mr-1' : 'ml-1'}`}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={forgetMutation.isPending}
              className="my-btn group w-full py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {forgetMutation.isPending ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  <span>{t.sendResetLinkBtn}</span>
                  <ArrowRight
                    size={20}
                    className={`group-hover:${isRtl ? '-translate-x-1' : 'translate-x-1'} transition-transform ${isRtl ? 'rotate-180' : ''}`}
                  />
                </>
              )}
            </button>

            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft size={16} className={isRtl ? 'rotate-180' : ''} />
                <span>{t.backToLogin}</span>
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

