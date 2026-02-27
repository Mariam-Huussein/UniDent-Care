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
  Lock,
  Phone,
  Fingerprint,
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

import {
  patientSignupSchema,
  PatientSignupValues,
} from "@/features/auth/schemas/patientSignupSchema";
import { authService } from "@/features/auth/services/authService";
import { FaTooth, FaVenusMars } from "react-icons/fa";

export default function PatientSignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientSignupValues>({
    resolver: zodResolver(patientSignupSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      nationalId: "",
      birthDate: "",
      gender: 0,
    } as PatientSignupValues,
  });

  const signupMutation = useMutation({
    mutationFn: authService.registerPatient,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Welcome to UniDent! Your account is ready.");
        router.push("/login");
      }
    },
    onError: (err: any) => {
      const errorData = err?.response?.data;
      if (errorData?.error?.errors) {
        errorData.error.errors.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(errorData?.message || "Something went wrong");
      }
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-100/50 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl relative z-10"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 font-bold mb-6 hover:translate-x-[-4px] transition-transform group"
        >
          <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
            <ChevronLeft size={18} />
          </div>
          Back
        </button>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-white p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex relative mb-4">
              <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 animate-pulse" />
              <div className="relative w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <FaTooth size={28} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Patient Registration
            </h2>
            <p className="mt-2 text-slate-500 font-medium italic">
              Your dental health journey starts here
            </p>
          </div>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit((data: any) => {
              const payload = {
                ...data,
                fullName: `${data.firstName} ${data.lastName}`.trim(),
              };
              delete payload.firstName;
              delete payload.lastName;
              signupMutation.mutate(payload);
            })}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5"
          >
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                First Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  {...register("firstName", { required: "First name is required" })}
                  className={`w-full bg-slate-50 border-2 ${errors.firstName ? "border-red-100" : "border-slate-50 focus:border-blue-600"} rounded-2xl pl-11 pr-4 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="Ahmed"
                />
              </div>
              {errors.firstName && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.firstName.message as string}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Last Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  {...register("lastName", { required: "Last name is required" })}
                  className={`w-full bg-slate-50 border-2 ${errors.lastName ? "border-red-100" : "border-slate-50 focus:border-blue-600"} rounded-2xl pl-11 pr-4 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="Salem"
                />
              </div>
              {errors.lastName && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.lastName.message as string}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full bg-slate-50 border-2 ${errors.email ? "border-red-100" : "border-slate-50 focus:border-blue-600"} rounded-2xl pl-11 pr-4 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="ahmed@example.com"
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
                Secure Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-slate-50 border-2 ${errors.password ? "border-red-100" : "border-slate-50 focus:border-blue-600"} rounded-2xl pl-11 pr-12 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
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

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Phone Number
              </label>
              <div className="relative group">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  {...register("phoneNumber")}
                  className={`w-full bg-slate-50 border-2 ${errors.phoneNumber ? "border-red-100" : "border-slate-50 focus:border-blue-600"} rounded-2xl pl-11 pr-4 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="+20 123..."
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                National ID
              </label>
              <div className="relative group">
                <Fingerprint
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  {...register("nationalId")}
                  className={`w-full bg-slate-50 border-2 ${errors.nationalId ? "border-red-100" : "border-slate-50 focus:border-blue-600"} rounded-2xl pl-11 pr-4 py-3 outline-none transition-all focus:bg-white`}
                  placeholder="14-digit number"
                />
              </div>
              {errors.nationalId && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.nationalId.message}
                </p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Date of Birth
              </label>
              <div className="relative group">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  type="date"
                  {...register("birthDate")}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl pl-11 pr-4 py-3 outline-none transition-all focus:bg-white appearance-none"
                />
              </div>
              {errors.birthDate && (
                <p className="text-[11px] font-bold text-red-500 ml-1">
                  {errors.birthDate.message}
                </p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="space-y-1.5 md:col-span-2"
            >
              <label className="text-sm font-bold text-slate-700 ml-1">
                Gender
              </label>
              <div className="relative group">
                <FaVenusMars
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <select
                  {...register("gender", {
                    setValueAs: (v) => parseInt(v, 10),
                  })}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl pl-11 pr-4 py-3 outline-none transition-all appearance-none cursor-pointer focus:bg-white text-slate-700 font-medium"
                >
                  <option value="0">Male</option>
                  <option value="1">Female</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ArrowRight size={16} className="rotate-90" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="group relative w-full bg-slate-900 text-white py-4 rounded-[1.25rem] font-bold text-lg transition-all duration-300 hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-100 active:scale-[0.98] disabled:opacity-70"
              >
                <div className="flex items-center justify-center gap-2">
                  {signupMutation.isPending ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <>
                      <span>Create My Account</span>
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
            Already registered?{" "}
            <a
              href="/login"
              className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4"
            >
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
