"use client";

import { useState } from "react";
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
  BookOpen,
} from "lucide-react";

import {
  StudentSignupFormValues,
  studentSignupSchema,
} from "@/features/auth/schemas/studentSignupSchema";
import { authService } from "@/features/auth/services/authService";
import { StudentSignupPayload } from "@/features/auth/types/studentPayload.Types";

export default function StudentSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentSignupFormValues>({
    resolver: zodResolver(studentSignupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: (data: StudentSignupPayload) =>
      authService.registerStudent(data),

    onSuccess: (res) => {
      if (res.success) {
        toast.success("Student account created! Welcome to the academy.");
        router.push("/login");
      }
    },

    onError: (err: any) => {
      const serverErrors = err?.response?.data?.error?.errors;

      if (Array.isArray(serverErrors)) {
        serverErrors.forEach((msg: string) => toast.error(msg));
      } else if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Registration failed. Please check your inputs.");
      }
    },
  });

  const onSubmit = (data: StudentSignupFormValues) => {
    const formattedData = {
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
    };

    signupMutation.mutate(formattedData);
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
    <div className="relative min-h-screen flex items-center justify-center bg-[#F9FAFF] py-12 px-4 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-60" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 rounded-full blur-[100px] opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-indigo-600 font-bold mb-6 hover:gap-3 transition-all group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          Back
        </button>

        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(79,70,229,0.1)] border border-indigo-50/50 p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex relative mb-4">
              <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-20 animate-pulse" />
              <div className="relative w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <BookOpen size={28} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Academic Access
            </h2>
            <p className="mt-2 text-slate-500 font-medium">
              Join the next generation of dental professionals
            </p>
          </div>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                  size={18}
                />
                <input
                  {...register("fullName")}
                  className={`w-full bg-slate-50 border-2 ${errors.fullName ? "border-red-100" : "border-slate-50 focus:border-indigo-500"} rounded-2xl pl-11 pr-4 py-3.5 outline-none transition-all focus:bg-white`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.fullName.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                University Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full bg-slate-50 border-2 ${errors.email ? "border-red-100" : "border-slate-50 focus:border-indigo-500"} rounded-2xl pl-11 pr-4 py-3.5 outline-none transition-all focus:bg-white`}
                  placeholder="student@university.edu"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Student ID
              </label>
              <div className="relative group">
                <IdCard
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                  size={18}
                />
                <input
                  {...register("universityId")}
                  className={`w-full bg-slate-50 border-2 ${errors.universityId ? "border-red-100" : "border-slate-50 focus:border-indigo-500"} rounded-2xl pl-11 pr-4 py-3.5 outline-none transition-all focus:bg-white`}
                  placeholder="ID Number"
                />
              </div>
              {errors.universityId && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.universityId.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Academic Year
              </label>
              <div className="relative group">
                <GraduationCap
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                  size={18}
                />
                <input
                  type="number"
                  {...register("grade")}
                  className={`w-full bg-slate-50 border-2 ${errors.grade ? "border-red-100" : "border-slate-50 focus:border-indigo-500"} rounded-2xl pl-11 pr-4 py-3.5 outline-none transition-all focus:bg-white`}
                  placeholder="Year (1-5)"
                />
              </div>
              {errors.grade && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.grade.message}
                </p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="space-y-1.5 md:col-span-2"
            >
              <label className="text-sm font-bold text-slate-700 ml-1">
                Secure Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-slate-50 border-2 ${errors.password ? "border-red-100" : "border-slate-50 focus:border-indigo-500"} rounded-2xl pl-11 pr-12 py-3.5 outline-none transition-all focus:bg-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="group relative w-full bg-slate-900 text-white py-4 rounded-[1.25rem] font-bold text-lg transition-all duration-300 hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 active:scale-[0.98] disabled:opacity-70"
              >
                <div className="flex items-center justify-center gap-2">
                  {signupMutation.isPending ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </div>
              </button>
            </motion.div>
          </motion.form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Already a member?{" "}
              <a
                href="/login"
                className="text-indigo-600 font-bold hover:underline decoration-2 underline-offset-4"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}