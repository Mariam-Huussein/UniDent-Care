import { ImageIcon } from "lucide-react";

export default function EmptyGalleryState() {
    return (
        <div className="w-full aspect-4/3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-3">
                <ImageIcon size={24} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No images uploaded</p>
            <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-0.5">Images will appear here</p>
        </div>
    );
}
