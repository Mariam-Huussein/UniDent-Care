"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/utils/api";
import {
  CalendarDays,
  Clock,
  User,
  Filter,
  SearchX,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function UpcomingAppointments() {
  const patientId = useSelector((state: RootState) => state.auth.user?.publicId);
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
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
        const sessionsData = Array.isArray(sessionsRes.data.data) ? sessionsRes.data.data : (sessionsRes.data.data?.items || []);

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
      day: date.toLocaleDateString(isRtl ? "ar-EG" : "en-US", { day: "numeric", month: "long" }),
      time: date.toLocaleTimeString(isRtl ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="p-6 border-b border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300">
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <CalendarDays size={20} />
            </div>
            {t.dashApptTitle}
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
            {t.dashApptDesc}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <Filter size={16} className="text-slate-400 dark:text-slate-500" />
          <label
            htmlFor="limit"
            className={`text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${isRtl ? 'ml-1' : 'mr-1'}`}
          >
            {t.dashApptShow}
          </label>
          <input
            id="limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-12 bg-transparent text-sm font-black text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 text-center"
            dir="ltr"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <th className={`px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {t.dashApptTablePatient}
                </th>
                <th className={`px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {t.dashApptTableSchedule}
                </th>
                <th className={`px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {t.dashApptTableTreatment}
                </th>
                <th className={`px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ${isRtl ? 'text-left' : 'text-right'}`}>
                  {t.dashApptTableAction}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {sessions.slice(0, limit).map((s) => {
                const { day, time } = formatDate(s.scheduledAt);
                return (
                  <tr
                    key={s.id}
                    className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black shadow-inner">
                          {s.patientName?.charAt(0) || <User size={20} />}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {s.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {day}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-400" /> {time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50">
                        {s.treatmentType}
                      </span>
                    </td>
                    <td className={`px-6 py-5 ${isRtl ? 'text-left' : 'text-right'}`}>
                      <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors">
                        {t.dashApptDetailsBtn}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-full mb-6">
              <SearchX size={48} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
              {t.dashApptEmptyTitle}
            </h4>
            <p className="text-slate-400 dark:text-slate-500 font-medium max-w-sm">
              {t.dashApptEmptyDesc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
