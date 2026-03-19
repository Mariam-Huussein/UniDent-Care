"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/utils/api";
import {
  ClipboardList,
  ChevronRight,
  ChevronLeft,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function RecentCases() {
  const patientId = useSelector(
    (state: RootState) => state.auth.user?.publicId,
  );
  const { t, language } = useLanguage();
  const isRtl = language === "ar";
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(5);
  const router = useRouter();

  useEffect(() => {
    if (!patientId) return;

    const fetchCases = async () => {
      try {
        setLoading(true);
        const casesRes = await api.get(`/Cases/patient/${patientId}`);
        const casesData = Array.isArray(casesRes.data.data)
          ? casesRes.data.data
          : casesRes.data.data?.items || [];

        const sortedCases = [...casesData].sort(
          (a, b) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
        );

        setCases(sortedCases);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [patientId]);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-200/50 dark:border-emerald-800/50",
          icon: <CheckCircle2 size={14} />,
          label: t.dashCasesStatusCompleted,
        };
      case "in progress":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-700 dark:text-blue-400",
          border: "border-blue-200/50 dark:border-blue-800/50",
          icon: <Clock size={14} />,
          label: t.dashCasesStatusProgress,
        };
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-800",
          text: "text-slate-700 dark:text-slate-300",
          border: "border-slate-200 dark:border-slate-700",
          icon: <AlertCircle size={14} />,
          label: status,
        };
    }
  };

  const showDetails = (id: string) => {
    router.push(`/my-cases/${id}`);
  };

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="p-6 border-b border-slate-50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-inner">
            <History size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">
              {t.dashCasesTitle}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              {t.dashCasesDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <span className={`text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${isRtl ? 'ml-1' : 'mr-1'}`}>
            {t.dashCasesLimit}
          </span>
          <input
            type="number"
            min={1}
            max={cases.length || 10}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-12 bg-transparent text-center text-sm font-black text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
            dir="ltr"
          />
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : cases.length > 0 ? (
          <div className="space-y-4">
            {cases.slice(0, limit).map((c) => {
              const status = getStatusStyles(c.status);
              return (
                <div
                  key={c.id}
                  className="cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white dark:bg-slate-900/50 border-2 border-slate-50 dark:border-slate-800/80 rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/10 transition-all duration-300 gap-4 sm:gap-0"
                  onClick={() => {
                    showDetails(c.id);
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="hidden sm:flex w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <ClipboardList size={22} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-slate-200 text-base">
                        {c.patientName || t.dashCasesGeneral}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1.5">
                        <Clock size={12} />
                        {t.dashCasesCreatedOn}{" "}
                        {new Date(c.createAt).toLocaleDateString(isRtl ? "ar-EG" : "en-GB")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent group-hover:bg-indigo-50 dark:group-hover:bg-slate-800 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                      {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">{t.dashCasesEmpty}</p>
          </div>
        )}
      </div>

      {cases.length > limit && (
        <div className="p-5 bg-slate-50/50 dark:bg-slate-800/20 text-center border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setLimit((prev) => prev + 5)}
            className="text-sm font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-all uppercase tracking-widest"
          >
            {t.dashCasesShowMore}
          </button>
        </div>
      )}
    </div>
  );
}
