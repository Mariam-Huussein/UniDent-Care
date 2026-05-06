import { z } from "zod";

export const patientSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phoneNumber: z.string().length(11, "Enter a valid phone number. must be 11 Number!"),
  nationalId: z.string().length(14, "Enter the 14-digit National ID"),
  birthDate: z.string().min(1, "Birth date is required"),
  gender: z.number({ error: "Gender is required" }),
  city: z.number({ error: "City is required" }),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

export const caseSchema = z.object({
  NationalId: z.string().length(14, "Enter the 14-digit National ID"),
  Description: z.string().min(10, "Please enter a detailed description of at least 10 characters"),
  IsPublic: z.boolean(),
  CaseTypeId: z.string().optional(),
  InitialDiagnosis: z.object({
    Stage: z.number(),
    CaseTypeId: z.string().optional(),
    Notes: z.string().optional(),
    TeethNumbers: z.array(z.number()),
  }),
});

export type CaseFormValues = z.infer<typeof caseSchema>;


export const addCaseSchema = z.object({
  NationalId: z.string().length(14, "Enter the 14-digit National ID"),
  Description: z.string().min(10, "Description must be at least 10 characters"),
  IsPublic: z.boolean(),
  CaseTypeId: z.string().min(1, "Case type is required"),
  InitialDiagnosis: z.object({
    Stage: z.number().default(1),
    CaseTypeId: z.string().optional(),
    Notes: z.string().optional(),
    TeethNumbers: z.array(z.number()).default([]),
  }),
  Images: z.array(z.any()).optional(),
});

export type AddCaseFormValues = z.infer<typeof addCaseSchema>;
