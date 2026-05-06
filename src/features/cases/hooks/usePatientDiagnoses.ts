"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { getPatientDiagnoses } from "../services/diagnosisService";
import { DiagnosisDto } from "@/services/PatientDashboardAnalytics";

interface UsePatientDiagnosesOptions {
  enabled?: boolean;
  page?: number;
  pageSize?: number;
}

export function usePatientDiagnoses(
  nationalId: string | null | undefined,
  options: UsePatientDiagnosesOptions = {}
) {
  const { enabled = true, page = 1, pageSize = 50 } = options;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["patientDiagnoses", nationalId, page, pageSize],
    queryFn: () => {
      if (!nationalId) throw new Error("National ID is required");
      return getPatientDiagnoses(nationalId, page, pageSize);
    },
    enabled: enabled && !!nationalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });

  // Memoize diagnoses list
  const diagnoses = useMemo<DiagnosisDto[]>(() => {
    if (!data?.data?.items) return [];
    return Array.isArray(data.data.items) ? data.data.items : [];
  }, [data]);

  // Memoize pagination info
  const paginationInfo = useMemo(
    () => ({
      totalCount: data?.data?.totalCount ?? 0,
      currentPage: data?.data?.currentPage ?? page,
      totalPages: data?.data?.totalPages ?? 0,
      hasPreviousPage: data?.data?.hasPreviousPage ?? false,
      hasNextPage: data?.data?.hasNextPage ?? false,
    }),
    [data, page]
  );

  // Show error toast
  useMemo(() => {
    if (isError && error) {
      console.error("Failed to load diagnoses:", error);
      toast.error("Failed to load patient diagnoses");
    }
  }, [isError, error]);

  // Memoize callback for refresh
  const refresh = useCallback(() => {
    return refetch();
  }, [refetch]);

  return {
    diagnoses,
    isLoading,
    isError,
    error,
    paginationInfo,
    refetch: refresh,
  };
}
