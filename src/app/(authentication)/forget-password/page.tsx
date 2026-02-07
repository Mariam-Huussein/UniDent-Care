"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  forgetPasswordSchema,
  ForgetPasswordValues,
} from "@/features/auth/schemas/forgetPasswordSchema";
import { authService } from "@/features/auth/services/authService";

export default function ForgetPassword() {
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
      const msg = error?.response?.data?.message || "Error sending email";
      toast.error(msg);
    },
  });

  const onSubmit = (data: ForgetPasswordValues) => {
    forgetMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Forgot Password? 🔑
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="name@example.com"
              className="w-full rounded-md border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={forgetMutation.isPending}
            className="w-full rounded-md bg-blue-600 py-2.5 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {forgetMutation.isPending ? "Sending Link..." : "Send Reset Link"}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
