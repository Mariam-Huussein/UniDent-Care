import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

export default function ImageDropzone({ files, onAdd, onRemove }: { files: File[]; onAdd: (f: File[]) => void; onRemove: (i: number) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/")); if (f.length) onAdd(f); }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 transition-all ${dragging ? "border-indigo-400 bg-indigo-50/60" : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-indigo-50/20"}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/30 flex items-center justify-center">
          <Upload size={22} className="text-indigo-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Drop images or <span className="text-indigo-600">browse</span></p>
          <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB each</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => { const f = Array.from(e.target.files || []); if (f.length) onAdd(f); e.target.value = ""; }} />
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {files.map((file, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
              <button type="button" onClick={() => onRemove(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
