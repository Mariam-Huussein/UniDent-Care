import ActionModal from "@/components/ui/ActionModal";
import { Send, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
    requestStatus: string;
    cancelLoading: boolean;
    onCancel: () => void;
}

export default function PendingRequestSection({ requestStatus, cancelLoading, onCancel }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="space-y-3">
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200/60 dark:border-blue-800/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Send size={14} className="text-blue-500" />
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                        Request {requestStatus}
                    </p>
                </div>
            </div>
            {
                requestStatus === "Pending" && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={cancelLoading}
                        className="my-btn-danger w-full py-3 group"
                    >
                        <XCircle size={15} className="group-hover:scale-110 transition-transform" />
                        Cancel Request
                    </button>
                )
            }
            <ActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAction={() => {
                    onCancel();
                }}
                title="Cancel Case Request"
                message="Are you sure you want to cancel this pending request? This action cannot be undone."
                actionText="Yes, Cancel it"
                cancelText="Keep it"
                variant="danger"
                isLoading={cancelLoading}
            />
        </div>
    );
}