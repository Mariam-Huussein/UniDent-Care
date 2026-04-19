import { z } from "zod";

export const patientSignupSchema = z.object({
    fullName: z.string().min(5, "Full name must be at least 5 characters"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one digit"),
    phone: z.string().trim().min(10, "Phone number is too short").regex(/^(\+20|0)?1[0125][0-9]{8}$/, "Invalid Egyptian phone number"),
    nationalId: z.string().length(14, "National ID must be 14 digits"),
    birthDate: z.string().min(1, "Birth date is required"),
    gender: z.number(),
    city: z.number().min(1, "Please select a city"),
});

export type PatientSignupValues = z.infer<typeof patientSignupSchema>;