import { z } from "zod";

export const sendRequestSchema = z.object({
    doctorUsername: z.string().min(1, "Doctor Username is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

export type SendRequestFormValues = z.infer<typeof sendRequestSchema>;
