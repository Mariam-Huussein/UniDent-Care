"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  StudentSignupFormValues,
  studentSignupSchema,
} from "@/features/auth/schemas/studentSignupSchema";
import { authService } from "@/features/auth/services/authService";
import { StudentSignupPayload } from "@/features/auth/types/studentPayload.Types";

export default function StudentSignup() {
  const router = useRouter();

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
      if (res?.success) {
        toast.success("Student account created successfully 🎉");
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
        toast.error("Registration failed. Please try again.");
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
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium">First Name</label>
              <input
                {...register("firstName")}
                autoComplete="given-name"
                className="mt-1 w-full rounded-md border p-2.5 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium">Last Name</label>
              <input
                {...register("lastName")}
                autoComplete="family-name"
                className="mt-1 w-full rounded-md border p-2.5 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Username</label>
            <input
              {...register("username")}
              autoComplete="username"
              className="mt-1 w-full rounded-md border p-2.5 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.username && (
              <p className="text-xs text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              autoComplete="email"
              className="mt-1 w-full rounded-md border p-2.5 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              type="tel"
              {...register("phone")}
              placeholder="01xxxxxxxxx"
              autoComplete="tel"
              className="mt-1 w-full rounded-md border p-2.5 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.phone && (
              <p className="text-xs text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">University</label>
            <input
              {...register("university")}
              className="mt-1 w-full rounded-md border p-2.5 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.university && (
              <p className="text-xs text-red-500">
                {errors.university.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">University ID</label>
            <input
              {...register("universityId")}
              className="mt-1 w-full rounded-md border p-2.5 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.universityId && (
              <p className="text-xs text-red-500">
                {errors.universityId.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Level</label>
            <input
              type="number"
              min={1}
              max={7}
              {...register("level", { valueAsNumber: true })}
              className="mt-1 w-full rounded-md border p-2.5 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.level && (
              <p className="text-xs text-red-500">
                {errors.level.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border p-2.5 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending || isSubmitting}
            className="w-full rounded-md bg-indigo-600 py-3 text-white font-bold hover:bg-indigo-700 transition disabled:bg-indigo-300"
          >
            {signupMutation.isPending
              ? "Signing up..."
              : "Register as Student"}
          </button>
        </form>
      </div>
    </div>
  );
}