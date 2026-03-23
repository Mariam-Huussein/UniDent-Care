import { z } from "zod";

export const sendRequestSchema = z.object({
    doctorPublicId: z.string().min(1, "Doctor ID is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

export type SendRequestFormValues = z.infer<typeof sendRequestSchema>;
