import { z } from "zod";

export const addCaseSchema = z.object({
    patientId: z.string().uuid("Invalid Patient ID"),
    title: z.string().min(3, "Short Title"),
    description: z.string().min(10, "Short Description"),
    caseTypeId: z.string().min(1, "Case Type Is Required"),
});

export type AddCaseFormValues = z.infer<typeof addCaseSchema>;