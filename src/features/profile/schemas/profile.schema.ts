import { z } from "zod";

export const createPatientProfileSchema = (t: any) => z.object({
  fullName: z.string().min(2, { message: t?.validation?.required || "Required field" }),
  phoneNumber: z.string()
    .min(10, { message: t?.validation?.invalidPhone || "Invalid phone number" })
    .max(15, { message: t?.validation?.invalidPhone || "Invalid phone number" })
    .regex(/^\d+$/, { message: t?.validation?.numbersOnly || "Numbers only" }),
  nationalId: z.string()
    .length(14, { message: t?.validation?.invalidNationalId || "National ID must be 14 digits" })
    .regex(/^\d+$/, { message: t?.validation?.numbersOnly || "Numbers only" }),
  birthDate: z.string().min(1, { message: t?.validation?.required || "Required field" }),
  gender: z.coerce.number()
});

export const createStudentProfileSchema = (t: any) => z.object({
  fullName: z.string().min(2, { message: t?.validation?.required || "Required field" }),
  level: z.coerce.number().min(1, { message: t?.validation?.minLevel || "Minimum level is 1" }).max(10, { message: t?.validation?.maxLevel || "Maximum level is 10" })
});

export const createDoctorProfileSchema = (t: any) => z.object({
  name: z.string().min(2, { message: t?.validation?.required || "Required field" }),
  specialty: z.string().min(2, { message: t?.validation?.required || "Required field" }),
});
