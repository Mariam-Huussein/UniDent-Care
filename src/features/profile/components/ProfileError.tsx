import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileErrorProps {
  onRetry: () => void;
  message?: string;
  t: any;
}

export function ProfileError({ onRetry, message, t }: ProfileErrorProps) {
  return (
    <div className="max-w-3xl mx-auto p-6 mt-12">
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-3xl p-8 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          {t?.errors?.profileLoadFailed || "Failed to load profile"}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {message || t?.errors?.profileLoadMessage || "An error occurred while fetching your data. Please try again."}
        </p>
        <div className="pt-4">
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <RefreshCw size={16} />
            {t?.common?.retry || "Retry"}
          </Button>
        </div>
      </div>
    </div>
  );
}
