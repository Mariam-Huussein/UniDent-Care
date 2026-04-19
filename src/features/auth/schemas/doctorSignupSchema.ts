import { z } from "zod";

export const doctorSignupSchema = z.object({
    fullName: z.string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name is too long"), 
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[a-zA-Z][a-zA-Z0-9_]+$/, "Username must start with a letter and contain only letters/numbers"),
    email: z.string().email("Invalid email address"),
    phone: z.string().trim()
        .min(10, "Phone number is too short")
        .regex(/^(\+20|0)?1[0125][0-9]{8}$/, "Invalid Egyptian phone number (e.g., 01012345678)"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one digit"),
    specialty: z.string().min(2, "Specialty is required"),
    universityId: z.string().min(2, "University ID is required")
});

export type DoctorSignupValues = z.infer<typeof doctorSignupSchema>;