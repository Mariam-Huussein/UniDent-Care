"use client"

import { patientSignupSchema, PatientSignupValues } from "@/features/auth/schemas/patientSignupSchema";
import { authService } from "@/features/auth/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function PatientSignup() {
  const router = useRouter();
  const {register, handleSubmit,  formState:{errors}} = useForm<PatientSignupValues>({
    resolver:zodResolver(patientSignupSchema),
    defaultValues: {
      gender: 0, 
    }
  })

  const signupMutation = useMutation({
    mutationFn:authService.registerPatient,
    onSuccess:(res) => {
      if(res.success) {
        toast.success("Acount created! Please login")
        router.push("/login")
      }
    },
    onError:(err:any) => {
      const errorData = err?.response?.data
      if(errorData?.error?.errors){
        errorData?.error?.errors.forEach((msg:string)=>{
          toast.error(msg);
        })
      }else{
        toast.error(errorData?.message || "Something went wrong")
      }
    }
  })
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl space-y-8 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-600">Patient Registration</h2>
          <p className="mt-2 text-gray-600">Join UniDent Care to manage your dental health</p>
        </div>

        <form onSubmit={handleSubmit((data) => signupMutation.mutate(data))} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input {...register("fullName")} className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-blue-500" />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" {...register("email")} className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-blue-500" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" {...register("password")} className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-blue-500" />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input {...register("phoneNumber")} className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-blue-500" />
            {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">National ID</label>
            <input {...register("nationalId")} className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-blue-500" />
            {errors.nationalId && <p className="text-xs text-red-500">{errors.nationalId.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Birth Date</label>
            <input type="date" {...register("birthDate")} className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-blue-500" />
            {errors.birthDate && <p className="text-xs text-red-500">{errors.birthDate.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Gender</label>
            <select {...register("gender")} className="mt-1 w-full rounded-md border p-2.5 outline-none focus:ring-1 focus:ring-blue-500">
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="md:col-span-2 w-full rounded-md bg-blue-600 py-3 text-white font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {signupMutation.isPending ? "Creating Account..." : "Register as Patient"}
          </button>
        </form>
      </div>
    </div>
  );
}