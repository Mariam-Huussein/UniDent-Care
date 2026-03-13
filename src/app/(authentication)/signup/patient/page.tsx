"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
  MapPin,
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
      fullName: "",
      password: "",
      phoneNumber: "",
      nationalId: "",
      birthDate: "",
      gender: 0,
      city: 0,
    },
  });

  const signupMutation = useMutation({
    mutationFn: authService.registerPatient,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    },
  });

  const onSubmit = (data: PatientSignupValues) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] py-12 px-4 overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100/50 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 font-bold mb-6 hover:-translate-x-1 transition-transform">
          <ChevronLeft size={18} /> Back
        </button>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <FaTooth size={28} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Create Account</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            
            {/* Full Name */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  {...register("fullName")}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl pl-11 pr-4 py-3 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 font-bold">{errors.fullName.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl pl-11 pr-12 py-3 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  {...register("phoneNumber")}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl pl-11 pr-4 py-3 outline-none transition-all"
                  placeholder="01234567890"
                />
              </div>
              {errors.phoneNumber && <p className="text-xs text-red-500 font-bold">{errors.phoneNumber.message}</p>}
            </div>

            {/* National ID */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">National ID</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  {...register("nationalId")}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl pl-11 pr-4 py-3 outline-none transition-all"
                  placeholder="14-digit ID"
                />
              </div>
              {errors.nationalId && <p className="text-xs text-red-500 font-bold">{errors.nationalId.message}</p>}
            </div>

            {/* Birth Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  {...register("birthDate")}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl pl-11 pr-4 py-3 outline-none transition-all"
                />
              </div>
              {errors.birthDate && <p className="text-xs text-red-500 font-bold">{errors.birthDate.message}</p>}
            </div>

            {/* Gender - FIXED WITH valueAsNumber */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Gender</label>
              <div className="relative">
                <FaVenusMars className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  {...register("gender", { valueAsNumber: true })}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl pl-11 pr-4 py-3 outline-none appearance-none cursor-pointer"
                >
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                </select>
              </div>
            </div>

            {/* City - FIXED WITH valueAsNumber */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  {...register("city", { valueAsNumber: true })}
                  className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-600 rounded-2xl pl-11 pr-4 py-3 outline-none appearance-none cursor-pointer"
                >
                  <option value={0}>Select City</option>
                  <option value={1}>Cairo</option>
                  <option value={2}>Alexandria</option>
                </select>
              </div>
              {errors.city && <p className="text-xs text-red-500 font-bold">{errors.city.message}</p>}
            </div>

            <div className="md:col-span-2 pt-6">
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {signupMutation.isPending ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}