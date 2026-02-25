import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";
import { sendCaseRequest } from "../server/case.action";
import { sendRequestSchema, SendRequestFormValues } from "../schemas/sendRequestSchema";

export const useSendRequest = (caseId: string, onClose: () => void) => {
    const studentId = useSelector((state: RootState) => state.auth.user?.publicId || "");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<SendRequestFormValues>({
        resolver: zodResolver(sendRequestSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: SendRequestFormValues) => {
        setLoading(true);
        try {
            const response = await sendCaseRequest({
                patientCasePublicId: caseId,
                studentPublicId: studentId,
                doctorPublicId: data.doctorPublicId.trim(),
                description: data.description.trim(),
            });

            if (response.success) {
                toast.success("Request sent successfully!");
                onClose();
            } else {
                toast.error("Failed to send request");
            }
        } catch (err: any) {
            toast.error("Failed to send request");
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isValid,
        loading,
    };
};
