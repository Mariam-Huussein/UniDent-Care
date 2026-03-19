"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import CaseDetailsScreen from "@/features/cases/screens/CaseDetails.Screen";

export default function CaseModal({ id }: { id: string }) {
  const router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        onDismiss();
      }
    },
    [onDismiss],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onDismiss]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="bg-white w-full max-w-[1000px] max-h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto">
          <CaseDetailsScreen caseId={id} />
        </div>
      </div>
    </div>
  );
}
