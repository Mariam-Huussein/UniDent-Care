"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import api from "@/utils/api";
import {
  ClipboardList,
  ChevronRight,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

export function RecentCases() {
  const patientId = useSelector((state: RootState) => state.auth.user?.publicId);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(5);

  useEffect(() => {
    if (!patientId) return;

    const fetchCases = async () => {
      try {
        setLoading(true);
        const casesRes = await api.get(`/Cases/patient/${patientId}`);
        const casesData = Array.isArray(casesRes.data.data) ? casesRes.data.data : (casesRes.data.data?.items || []);

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

  // دالة لتحديد لون وشكل الـ Status Badge
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: <CheckCircle2 size={14} />,
          label: "Completed",
        };
      case "in progress":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: <Clock size={14} />,
          label: "In Progress",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: <AlertCircle size={14} />,
          label: status,
        };
    }
  };

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <History size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Recent Cases Status
            </h3>
            <p className="text-xs text-gray-500">
              Track your medical history updates
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <span className="text-xs font-medium text-gray-500 px-2">Limit</span>
          <input
            type="number"
            min={1}
            max={cases.length || 10}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-12 bg-white border border-gray-200 rounded text-sm font-bold px-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-50 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : cases.length > 0 ? (
          <div className="space-y-3">
            {cases.slice(0, limit).map((c) => {
              const status = getStatusStyles(c.status);
              return (
                <div
                  key={c.id}
                  className="group flex items-center justify-between p-4 bg-white border border-gray-50 rounded-xl hover:border-indigo-100 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex w-10 h-10 rounded-full bg-gray-50 items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                      <ClipboardList size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        {c.patientName || "General Case"}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Created on{" "}
                        {new Date(c.createAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-400 text-sm">No recent cases found.</p>
          </div>
        )}
      </div>

      {cases.length > limit && (
        <div className="p-4 bg-gray-50/50 text-center rounded-b-2xl">
          <button
            onClick={() => setLimit((prev) => prev + 5)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Show more cases
          </button>
        </div>
      )}
    </div>
  );
}
