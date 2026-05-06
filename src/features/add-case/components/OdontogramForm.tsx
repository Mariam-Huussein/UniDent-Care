"use client";

import { useState, useMemo, useEffect } from "react";
import type { ToothConditionGroup, ToothDetail } from "react-odontogram";
import "react-odontogram/style.css";
import { useRouter } from "next/navigation";

import { ToothData, ToothStatus } from "@/features/cases/types/CaseDetails.types";
import { buildConditions } from "@/features/cases/utils/odontogram.utils";
import { getCaseById } from "@/features/cases/server/case.action";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, ChevronDown, ExternalLink, Lock } from "lucide-react";
import OdontogramHeader from "@/features/cases/components/CaseDetails/Clinical/OdontogramParts/Odontogramheader";
import OdontogramChart from "@/features/cases/components/CaseDetails/Clinical/OdontogramParts/Odontogramchart";
import ToothDiagnosisCard from "@/features/cases/components/CaseDetails/Clinical/OdontogramParts/Toothdiagnosiscard";
import { ExistingToothCase } from "@/features/add-case/types/AddCase.types";

// ── Map case status → tooth color ─────────────────────────────────────────────
function caseStatusToToothStatus(status: string): ToothStatus {
  const s = status?.toLowerCase();
  if (s === "pending" || s === "underreview") return "needs-treatment"; // red
  if (s === "inprogress")                      return "in-progress";    // orange
  if (s === "completed")                       return "treated";        // green
  return "needs-treatment"; // default red for cancelled/rejected
}

interface OdontogramFormProps {
  history: any[];
  patientCases?: { id: string; status: number; createAt: string; name: string }[];
  selectedTeeth: number[];
  onToothSelect: (nums: number[]) => void;
  onToothDataUpdate: (toothNum: number, data: any) => void;
}

export default function OdontogramForm({
  history,
  patientCases = [],
  selectedTeeth,
  onToothSelect,
  onToothDataUpdate,
}: OdontogramFormProps) {
  const router = useRouter();

  // ── Fetch all case details → build tooth → case map ──────────────────────
  const [existingToothMap, setExistingToothMap] = useState<Map<number, ExistingToothCase>>(new Map());
  // teeth colored by case status
  const [caseTeeth, setCaseTeeth] = useState<ToothData[]>([]);

  useEffect(() => {
    if (!patientCases || patientCases.length === 0) return;

    Promise.all(
      patientCases.map((pc) =>
        getCaseById(pc.id)
          .then((res) => res?.data ?? null)
          .catch(() => null)
      )
    ).then((cases) => {
      const toothMap = new Map<number, ExistingToothCase>();
      const teeth: ToothData[] = [];

      cases.forEach((c) => {
        if (!c) return;
        const toothStatus = caseStatusToToothStatus(c.status);

        c.diagnosisdto?.forEach((diag) => {
          diag.teethNumbers?.forEach((toothNum) => {
            if (!toothMap.has(toothNum)) {
              toothMap.set(toothNum, {
                caseId: c.id,
                diagnosis: {
                  id: diag.id,
                  patientCaseId: c.id,
                  stage: diag.stage as number,
                  caseTypeId: diag.caseTypeId || "",
                  caseTypeName: diag.caseTypeName || "",
                  notes: diag.notes || "",
                  createdById: diag.createdById || "",
                  role: "",
                  isAccepted: false,
                  teethNumbers: diag.teethNumbers ?? [],
                },
              });
              teeth.push({
                number: toothNum,
                status: toothStatus,
                treatmentType: diag.caseTypeName || "",
                notes: diag.notes || "",
                caseTypeId: diag.caseTypeId || "",
              });
            }
          });
        });
      });

      setExistingToothMap(toothMap);
      setCaseTeeth(teeth);
    });
  }, [patientCases]);

  // ── History teeth (from diagnoses endpoint) — fallback coloring ──────────
  const historyTeeth: ToothData[] = useMemo(() => {
    if (!history || !Array.isArray(history)) return [];
    return history.flatMap((d) =>
      (d.teethNumbers ?? []).map((num: number) => ({
        id: d.id || "",
        number: num,
        status: "treated" as ToothStatus,
        treatmentType: d.caseTypeName || "",
        notes: d.notes || "",
        caseTypeId: d.caseTypeId,
      }))
    );
  }, [history]);

  // Prefer caseTeeth (status-colored) over historyTeeth
  const allTeeth = useMemo(() => {
    const caseNums = new Set(caseTeeth.map((t) => t.number));
    const filtered = historyTeeth.filter((t) => !caseNums.has(t.number));
    return [...caseTeeth, ...filtered];
  }, [caseTeeth, historyTeeth]);

  // ── Odontogram state ──────────────────────────────────────────────────────
  const [selectedDetail, setSelectedDetail] = useState<ToothDetail[]>([]);
  const [chartKey, setChartKey] = useState(0);
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [existingInfo, setExistingInfo] = useState<ExistingToothCase | null>(null);
  const [toothData, setToothData] = useState<ToothData>({
    number: 0,
    status: "needs-treatment",
    treatmentType: "",
    notes: "",
    caseTypeId: "",
  } as any);

  const conditions: ToothConditionGroup[] = useMemo(
    () => buildConditions(allTeeth),
    [allTeeth]
  );

  const teethMap = useMemo(
    () => new Map(allTeeth.map((t) => [t.number, t])),
    [allTeeth]
  );

  const handleToothSelect = (sel: ToothDetail[]) => {
    if (sel.length === 0) {
      setSelectedDetail([]);
      setMode("new");
      setExistingInfo(null);
      onToothSelect([]);
      return;
    }

    const last = sel[sel.length - 1];
    const toothNum = Number(last.notations.fdi);
    const existing = existingToothMap.get(toothNum);

    setSelectedDetail([last]);
    setChartKey((k) => k + 1);

    if (existing) {
      setMode("existing");
      setExistingInfo(existing);
      onToothSelect([]);
    } else {
      setMode("new");
      setExistingInfo(null);
      setToothData({
        number: toothNum,
        status: "needs-treatment",
        treatmentType: "",
        notes: "",
        caseTypeId: "",
      } as any);
      onToothSelect([toothNum]);
    }
  };

  const handleUpdate = (num: number, updates: Partial<ToothData>) => {
    setToothData((prev) => {
      const next = { ...prev, ...updates };
      onToothDataUpdate(num, next);
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedDetail([]);
    setMode("new");
    setExistingInfo(null);
    onToothSelect([]);
    setChartKey((k) => k + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 w-full">
      {/* Left: Odontogram Chart */}
      <div className="space-y-5">
        <OdontogramHeader readonly={false} />
        <OdontogramChart
          key={chartKey}
          conditions={conditions}
          teethMap={teethMap}
          diagnosedTeethMap={new Map()}
          selected={selectedDetail}
          isUnassigned={false}
          isDiagnosisActive={true}
          onSelectionChange={handleToothSelect}
          onToothClick={() => {}}
          onAfterViewClick={() => {}}
        />
      </div>

      {/* Right: Diagnosis Panel */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 h-fit sticky top-4 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <ClipboardList size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Initial Diagnosis</h3>
            <p className="text-[10px] text-slate-400">Record findings for selected teeth</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Empty state */}
          {selectedDetail.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <ChevronDown className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-xs text-slate-400">Select a tooth to start diagnosing</p>
            </motion.div>
          )}

          {/* Existing case — read-only */}
          {selectedDetail.length > 0 && mode === "existing" && existingInfo && (
            <motion.div
              key={`existing-${selectedDetail[0].notations.fdi}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Locked notice */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/40 rounded-xl">
                <Lock size={13} className="text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  This tooth already has a case. View only.
                </p>
              </div>

              {/* Tooth header */}
              <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                    {selectedDetail[0].notations.fdi}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Tooth #{selectedDetail[0].notations.fdi}
                </span>
              </div>

              {/* Diagnosis details */}
              <div className="space-y-2.5">
                {existingInfo.diagnosis.caseTypeName && (
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Treatment Type</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{existingInfo.diagnosis.caseTypeName}</p>
                  </div>
                )}
                {existingInfo.diagnosis.notes && (
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Notes</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{existingInfo.diagnosis.notes}</p>
                  </div>
                )}
              </div>

              {/* View case link */}
              <button
                type="button"
                onClick={() => router.push(`/cases/${existingInfo.caseId}`)}
                className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <ExternalLink size={13} />
                View Case Details
              </button>

              {/* Deselect */}
              <button
                type="button"
                onClick={clearSelection}
                className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors py-1"
              >
                ← Select a different tooth
              </button>
            </motion.div>
          )}

          {/* New tooth — editable */}
          {selectedDetail.length > 0 && mode === "new" && (
            <motion.div
              key={`new-${selectedDetail[0].notations.fdi}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ToothDiagnosisCard
                selTooth={selectedDetail[0]}
                toothData={toothData}
                onRemove={clearSelection}
                onUpdate={handleUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
