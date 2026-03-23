"use client";

import { useState } from "react";
import { FileText, Bone } from "lucide-react";

const TABS = [
    { key: "pain", label: "Pain Description", icon: FileText },
    { key: "structure", label: "Oral Pain Structure", icon: Bone },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function CaseDetailTabs() {
    const [activeTab, setActiveTab] = useState<TabKey>("pain");

    return (
        <div>
            {/* Tab Headers */}
            <div className="flex border-b border-gray-100">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer
                            ${activeTab === key
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        <Icon size={16} />
                        <span className="hidden sm:inline">{label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-5">
                {activeTab === "pain" && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-800">Pain Description</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            The patient reports intermittent sharp pain in the lower right quadrant,
                            particularly when biting down on hard foods. The pain has been persistent
                            for approximately two weeks and is rated 6/10 in intensity. No radiating
                            pain has been reported.
                        </p>
                    </div>
                )}

                {activeTab === "structure" && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-800">Oral Pain Structure</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Examination reveals mild sensitivity on percussion of tooth #30. No visible
                            cracks or fractures. Periodontal probing depths within normal limits.
                            Radiographic evaluation suggests possible early periapical changes at the
                            apex of the distal root.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
