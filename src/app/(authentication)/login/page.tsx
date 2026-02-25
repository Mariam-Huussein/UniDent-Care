"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

import {
  loginSchema,
  LoginFormValues,
} from "@/features/auth/schemas/loginSchema";
import {
  authService,
  getProfileByRole,
} from "@/features/auth/services/authService";
import { login, setUserFromReload } from "@/features/auth/store/authSlice";
import { LoginResponse } from "@/features/auth/types";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (response: LoginResponse) => {
      const { token, roles, publicId } = response.data;

      if (response.success && token && roles) {
        Cookies.set("token", token, { expires: 7 });
        Cookies.set("user_role", roles[0], { expires: 7 });

        dispatch(login(response.data));

        try {
          const user = await getProfileByRole(roles[0], publicId);

          dispatch(setUserFromReload({ user, role: roles[0] }));

          toast.success(response.message || "Login successful!");
          router.replace("/dashboard");
        } catch (err: any) {
          console.error(err);
          toast.error("Failed to fetch user data after login");
        }
      } else {
        toast.error(response.message || "Login failed");
      }
    },
    onError: (error: any) => {
      const apiError = error?.response?.data?.error?.errors?.[0];
      const generalMsg = error?.response?.data?.message;
      toast.error(apiError || generalMsg || "Login failed. Please try again.");
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">🦷 UniDent Care</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="doctor@unident.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center text-sm">
            <a
              href="/forget-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

// onSuccess: (response) => {
//   const { token, roles } = response.data;
//   if (response.success && token && roles) {
//     Cookies.set("token", token, { expires: 7 });
//     Cookies.set("user_role", roles[0], { expires: 7 });

//     dispatch(login(response.data));
//     toast.success(response.message || "Login successful!");

//     router.replace("/dashboard");
//   } else {
//     toast.error(response.message || "Login failed");
//   }
// },
