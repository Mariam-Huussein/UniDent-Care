import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(3, "Please enter a valid email or phone number"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export type LoginFormValues = z.infer<typeof loginSchema>;