import { useEffect, useState } from "react";
import api from "@/utils/api";

export interface StudentStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalSessions: number;
  completedSessions: number;
  totalCases: number;
}

const initialStats: StudentStats = {
  totalRequests: 0,
  pendingRequests: 0,
  approvedRequests: 0,
  rejectedRequests: 0,
  totalSessions: 0,
  completedSessions: 0,
  totalCases: 0,
};

export function useStudentStats() {
  const [stats, setStats] = useState<StudentStats>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/Users/me/Statistics");
        const data = res.data.data;

        setStats({
          totalRequests: data.totalRequests ?? 0,
          pendingRequests: data.pendingRequests ?? 0,
          approvedRequests: data.approvedRequests ?? 0,
          rejectedRequests: data.rejectedRequests ?? 0,
          totalSessions: data.totalSessions ?? 0,
          completedSessions: data.completedSessions ?? 0,
          totalCases: data.totalCases ?? 0,
        });
      } catch (error) {
        console.error("Error fetching student stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const sessionProgress =
    stats.totalSessions > 0
      ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
      : 0;

  const requestApprovalRate =
    stats.totalRequests > 0
      ? Math.round((stats.approvedRequests / stats.totalRequests) * 100)
      : 0;

  return { stats, loading, sessionProgress, requestApprovalRate };
}
