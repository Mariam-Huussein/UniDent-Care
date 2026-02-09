"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  doctorSignupSchema,
  DoctorSignupValues,
} from "@/features/auth/schemas/doctorSignupSchema";
import { authService } from "@/features/auth/services/authService";

export default function DoctorSignup() {
  const router = useRouter();
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-teal-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-teal-600">
            Doctor Registration
          </h2>
          <p className="mt-2 text-gray-600">
            Join our professional medical network
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => signupMutation.mutate(data))}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              {...register("name")}
              className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-teal-500"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-teal-500"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Specialty</label>
            <input
              {...register("specialty")}
              placeholder="e.g. Orthodontics"
              className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-teal-500"
            />
            {errors.specialty && (
              <p className="text-xs text-red-500">{errors.specialty.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">University ID</label>
            <input
              type="number"
              {...register("universityId")}
              className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-teal-500"
            />
            {errors.universityId && (
              <p className="text-xs text-red-500">
                {errors.universityId.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-teal-500"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full rounded-md bg-teal-600 py-3 text-white font-bold hover:bg-teal-700 transition disabled:bg-teal-300"
          >
            {signupMutation.isPending
              ? "Creating Account..."
              : "Register as Doctor"}
          </button>
        </form>
      </div>
    </div>
  );
}
