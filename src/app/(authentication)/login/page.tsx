"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import {
  loginSchema,
  LoginFormValues,
} from "@/features/auth/schemas/loginSchema";
import {
  authService,
  getProfileByRole,
} from "@/features/auth/services/authService";
import { login, setUserFromReload } from "@/features/auth/store/authSlice";
import { getDecodedToken } from "@/utils/decodeToken";
import { FaTooth } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (response) => {
      const { token, roles } = response.data;
      if (response.success && token && roles) {
        Cookies.set("token", token, { expires: 7 });
        Cookies.set("user_role", roles[0], { expires: 7 });
        dispatch(login(response.data));

        const decoded = getDecodedToken();
        if (!decoded) return;

        try {
          const user = await getProfileByRole(decoded.role, decoded.userId);
          dispatch(setUserFromReload({ user, role: decoded.role }));
          toast.success("Welcome back to UniDent!");
          router.replace("/dashboard");
        } catch (err) {
          toast.error("Connected, but failed to load profile.");
        }
      }
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    },
  });

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate(data);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] overflow-hidden px-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[450px]"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-white p-8 sm:p-12">
          <div className="text-center mb-10">
              <div className="inline-flex relative mb-6 group">
                <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                <div className="relative w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-200/50 transform group-hover:rotate-6 transition-transform duration-300">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <FaTooth size={32} strokeWidth={2.5} />
                  </motion.div>
                </div>
                <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                UniDent <span className="text-blue-600">Care</span>
              </h2>
              <p className="mt-2 text-slate-500 font-medium italic">
                Your Smile, Our Passion
              </p>
            </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full bg-white border-2 ${errors.email ? "border-red-100" : "border-slate-100 focus:border-blue-600"} rounded-2xl pl-12 pr-4 py-3.5 outline-none transition-all font-medium placeholder:text-slate-400`}
                  placeholder="name@unident.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-bold text-red-500 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">
                  Password
                </label>
                <a
                  href="/forget-password"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full bg-white border-2 ${errors.password ? "border-red-100" : "border-slate-100 focus:border-blue-600"} rounded-2xl pl-12 pr-12 py-3.5 outline-none transition-all font-medium placeholder:text-••••••••`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-bold text-red-500 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loginMutation.isPending ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </div>
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 font-medium text-sm">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 font-bold hover:underline"
            >
              Create one
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
