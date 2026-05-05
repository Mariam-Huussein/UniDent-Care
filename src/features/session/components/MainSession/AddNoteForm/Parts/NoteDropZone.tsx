import { UploadCloud } from "lucide-react";

export const NoteDropZone = ({ isDragging, onAction, actions }: { isDragging: boolean; onAction: () => void; actions: any }) => (
    <div
        onDragOver={(e) => { e.preventDefault(); actions.setIsDragging(true); }}
        onDragLeave={() => actions.setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); actions.setIsDragging(false); actions.addFiles(e.dataTransfer.files); }}
        onClick={onAction}
        className={`relative flex flex-col items-center gap-2.5 rounded-2xl border-2 border-dashed px-6 py-5 cursor-pointer transition-all ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-slate-50/60 hover:border-indigo-400"
            }`}
    >
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDragging ? "bg-indigo-100" : "bg-white shadow-sm"}`}>
            <UploadCloud size={22} className="text-indigo-400" />
        </div>
        <div className="text-center">
            <p className="text-sm font-medium text-slate-500">{isDragging ? "Drop here" : "Drag & drop files"}</p>
            <p className="text-xs text-slate-400">or <span className="text-indigo-500 underline font-semibold">browse</span></p>
        </div>
    </div>
);
