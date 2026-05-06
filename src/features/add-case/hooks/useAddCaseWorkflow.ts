

// import { useState, useCallback } from "react";
// import { useForm } from "react-hook-form";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import toast from "react-hot-toast";

// export const useAddCaseLogic = (user: any, userDetails: any) => {
//   const [step, setStep] = useState(1);
//   const [patientId, setPatientId] = useState("");
//   const [NationalId, setNationalId] = useState("");
//   const [images, setImages] = useState<File[]>([]);
  
//   const formMethods = useForm({
//     defaultValues: {
//       NationalId: "", fullName: "", phoneNumber: "", birthDate: "",
//       gender: 0, city: 0, Description: "", IsPublic: false,
//       InitialDiagnosis: { Stage: 1, CaseTypeId: "", Notes: "", TeethNumbers: [] }
//     }
//   });

//   const { setValue } = formMethods;

//   // Step 1: Register Patient
//   const registerPatientMutation = useMutation({
//     mutationFn: (data: any) => axios.post("https://dental-hup1.runasp.net/api/v2/patients", data),
//     onSuccess: (res, data) => {
//       if (res.data.success) {
//         toast.success("Patient registered successfully!");
//         setPatientId(res.data.data);
//         setNationalId(data.NationalId);
//         setStepAndPatient(2, res.data.data);
//       }
//     },
//     onError: () => toast.error("Failed to register patient.")
//   });

//   // Step 2: Fetch History
//   const { data: historyData } = useQuery({
//     queryKey: ["patientHistory", NationalId],
//     queryFn: () => axios.get(`https://dental-hup1.runasp.net/api/v2/Diagnoses/patient/${NationalId}`),
//     enabled: !!NationalId,
//   });

//   // Step 3: Create Case
//   const createCaseMutation = useMutation({
//     mutationFn: (formData: FormData) => axios.post("https://dental-hup1.runasp.net/api/v2/Cases", formData),
//     onSuccess: () => {
//       toast.success("Case created successfully!");
//       setStep(1);
//       setPatientId("");
//     },
//     onError: () => toast.error("Error creating case.")
//   });

//   const onToothDataUpdate = useCallback((num: number, updates: any) => {
//     if (updates.treatmentType) {
//       setValue("InitialDiagnosis.CaseTypeId", updates.caseTypeId);
//       setValue("InitialDiagnosis.Notes", updates.notes || "");
//     }
//   }, [setValue]);

//   return {
//     step, setStep,
//     patientId,
//     formMethods,
//     registerPatientMutation,
//     createCaseMutation,
//     historyData,
//     onToothDataUpdate,
//     images, setImages
//   };
// };