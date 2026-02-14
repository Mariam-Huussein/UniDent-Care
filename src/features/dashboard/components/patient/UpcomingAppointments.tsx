"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/utils/api";
import {
  CalendarDays,
  Clock,
  User,
  Briefcase,
  Filter,
  SearchX,
} from "lucide-react";

export function UpcomingAppointments() {
  const patientId = useSelector((state: RootState) => state.auth.user?.userId);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(5);

  useEffect(() => {
    if (!patientId) return;

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const sessionsRes = await api.get(`/Sessions/patient/${patientId}`, {
          params: { page: 1, pageSize: 100 },
        });
        const sessionsData = sessionsRes.data.data || [];

        const scheduled = sessionsData.filter(
          (s: any) => s.status === "Scheduled",
        );

        scheduled.sort(
          (a: any, b: any) =>
            new Date(a.scheduledAt).getTime() -
            new Date(b.scheduledAt).getTime(),
        );

        setSessions(scheduled);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [patientId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarDays className="text-blue-600" size={24} />
            Upcoming Appointments
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage your next health milestones
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          <Filter size={16} className="text-gray-400" />
          <label
            htmlFor="limit"
            className="text-xs font-semibold uppercase text-gray-500"
          >
            Show:
          </label>
          <input
            id="limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-12 bg-transparent text-sm font-bold focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Patient Details
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Schedule
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Treatment
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sessions.slice(0, limit).map((s) => {
                const { day, time } = formatDate(s.scheduledAt);
                return (
                  <tr
                    key={s.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {s.patientName?.charAt(0) || <User size={18} />}
                        </div>
                        <span className="font-medium text-gray-700">
                          {s.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                          {day}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {s.treatmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <SearchX size={40} className="text-gray-300" />
            </div>
            <h4 className="text-gray-600 font-medium">
              No upcoming appointments
            </h4>
            <p className="text-gray-400 text-sm">
              When you book a session, it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
