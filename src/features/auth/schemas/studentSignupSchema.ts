import { z } from "zod";

export const studentSignupSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters"),

    lastName: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters"),

    email: z
        .string()
        .email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one digit"),
    university: z
        .string()
        .min(2, "University is required"),
    universityId: z
        .string()
        .min(2, "University ID is required"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters"),
    level: z
        .number()
        .int()
        .min(1, "Level is required")
        .max(7, "Level must be between 1 and 7"),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^01[0-9]{9}$/, "Invalid Egyptian phone number"),
});

export type StudentSignupFormValues = z.infer<typeof studentSignupSchema>;