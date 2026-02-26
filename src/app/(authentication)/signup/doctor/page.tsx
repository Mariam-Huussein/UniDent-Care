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
  Stethoscope,
  IdCard,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

import {
  doctorSignupSchema,
  DoctorSignupValues,
} from "@/features/auth/schemas/doctorSignupSchema";
import { authService } from "@/features/auth/services/authService";
import { FaTooth } from "react-icons/fa";

export default function DoctorSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorSignupValues>({
    resolver: zodResolver(doctorSignupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: authService.registerDoctor,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Doctor account created successfully!");
        router.push("/login");
      }
    },
    onError: (err: any) => {
      const serverErrors = err?.response?.data?.error?.errors;
      if (Array.isArray(serverErrors)) {
        serverErrors.forEach((msg) => toast.error(msg));
      } else {
        toast.error("Registration failed. Please check your data.");
      }
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F4F9F9] py-12 px-4 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-teal-600 font-bold mb-6 hover:translate-x-[-4px] transition-transform group"
        >
          <div className="p-1 rounded-full group-hover:bg-teal-50">
            <ChevronLeft size={20} />
          </div>
          Back
        </button>

        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(20,80,80,0.1)] border border-white p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex relative mb-4">
              <div className="absolute inset-0 bg-teal-400 blur-xl opacity-20 animate-pulse" />
              <div className="relative w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
                <FaTooth size={28} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Join UniDent
            </h2>
            <p className="mt-2 text-slate-500 font-medium">
              Step into a world of digital dental care
            </p>
          </div>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit((data) => signupMutation.mutate(data))}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                  size={18}
                />
                <input
                  {...register("name")}
                  className={`w-full bg-slate-50/50 border-2 ${errors.name ? "border-red-100" : "border-slate-100 focus:border-teal-500"} rounded-2xl pl-11 pr-4 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="Dr. Ahmed Ali"
                />
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] font-bold text-red-500 ml-1"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full bg-slate-50/50 border-2 ${errors.email ? "border-red-100" : "border-slate-100 focus:border-teal-500"} rounded-2xl pl-11 pr-4 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="doctor@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Specialty
              </label>
              <div className="relative group">
                <Stethoscope
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                  size={18}
                />
                <input
                  {...register("specialty")}
                  className={`w-full bg-slate-50/50 border-2 ${errors.specialty ? "border-red-100" : "border-slate-100 focus:border-teal-500"} rounded-2xl pl-11 pr-4 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="e.g. Endodontics"
                />
              </div>
              {errors.specialty && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.specialty.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                University ID
              </label>
              <div className="relative group">
                <IdCard
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                  size={18}
                />
                <input
                  type="number"
                  {...register("universityId")}
                  className={`w-full bg-slate-50/50 border-2 ${errors.universityId ? "border-red-100" : "border-slate-100 focus:border-teal-500"} rounded-2xl pl-11 pr-4 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="1234567"
                />
              </div>
              {errors.universityId && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.universityId.message}
                </p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="space-y-2 md:col-span-2"
            >
              <label className="text-sm font-bold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-slate-50/50 border-2 ${errors.password ? "border-red-100" : "border-slate-100 focus:border-teal-500"} rounded-2xl pl-11 pr-12 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
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
                className="group relative w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-teal-600 hover:shadow-2xl hover:shadow-teal-100 active:scale-[0.98] disabled:opacity-70"
              >
                <div className="flex items-center justify-center gap-2">
                  {signupMutation.isPending ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <>
                      <span>Complete Registration</span>
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

          <p className="mt-8 text-center text-slate-500 font-medium text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-teal-600 font-bold hover:underline"
            >
              Log in here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
