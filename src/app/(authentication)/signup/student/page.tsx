"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  studentSignupSchema,
  StudentSignupValues,
} from "@/features/auth/schemas/studentSignupSchema";
import { authService } from "@/features/auth/services/authService";

export default function StudentSignup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSignupValues>({
    resolver: zodResolver(studentSignupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: authService.registerStudent,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Student account created! Welcome.");
        router.push("/login");
      }
    },
    onError: (err: any) => {
      const serverErrors = err?.response?.data?.error?.errors;
      if (Array.isArray(serverErrors)) {
        serverErrors.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error("Registration failed. Please check your data.");
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-indigo-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-600">
            Student Registration
          </h2>
          <p className="mt-2 text-gray-600">
            Join our academic dental community
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => signupMutation.mutate(data))}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              {...register("fullName")}
              className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">University Id</label>
            <input
              {...register("universityId")}
              className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.universityId && (
              <p className="text-xs text-red-500">
                {errors.universityId.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Grade / Year</label>
            <input
              type="number"
              {...register("grade")}
              className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.grade && (
              <p className="text-xs text-red-500">{errors.grade.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full rounded-md bg-indigo-600 py-3 text-white font-bold hover:bg-indigo-700 transition disabled:bg-indigo-300"
          >
            {signupMutation.isPending ? "Signing up..." : "Register as Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
