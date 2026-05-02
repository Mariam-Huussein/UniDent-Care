import { z } from "zod";

export const addNoteSchema = z.object({
    note: z
        .string()
        .min(10, "Note must be at least 10 characters")
        .max(2000, "Note cannot exceed 2000 characters"),
});

export type AddNoteFormValues = z.infer<typeof addNoteSchema>;
