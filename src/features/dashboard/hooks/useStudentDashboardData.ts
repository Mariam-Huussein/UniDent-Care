import { useQuery } from "@tanstack/react-query";
import { getStudentSessions, getUpcomingSessions } from "../server/studentDashboard.action";
import { getStudentMyCases, getStudentMyRequests } from "@/features/cases/server/case.action";
import { getStudentById } from "@/server/getUsers.action";
import Cookies from "js-cookie";

export const useStudentDashboardData = () => {
  const studentId = Cookies.get("user_id");

  const profileQuery = useQuery({
    queryKey: ["student-profile", studentId],
    queryFn: () => getStudentById(studentId as string),
    enabled: !!studentId,
  });

  const sessionsQuery = useQuery({
    queryKey: ["student-sessions", studentId],
    queryFn: () => getStudentSessions(studentId as string),
    enabled: !!studentId,
  });

  const upcomingSessionsQuery = useQuery({
    queryKey: ["student-upcoming-sessions", studentId],
    queryFn: () => getUpcomingSessions(studentId as string),
    enabled: !!studentId,
  });

  const myCasesQuery = useQuery({
    queryKey: ["student-my-cases", studentId],
    queryFn: () => getStudentMyCases({ pageSize: 100 }),
    enabled: !!studentId,
  });

  const myRequestsQuery = useQuery({
    queryKey: ["student-my-requests", studentId],
    queryFn: () => getStudentMyRequests({ pageSize: 100 }),
    enabled: !!studentId,
  });

  return {
    profile: profileQuery,
    sessions: sessionsQuery,
    upcomingSessions: upcomingSessionsQuery,
    myCases: myCasesQuery,
    myRequests: myRequestsQuery,
  };
};
