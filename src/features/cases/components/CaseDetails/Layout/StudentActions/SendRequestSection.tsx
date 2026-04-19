import { Send } from "lucide-react";

interface Props {
    onSendRequest: () => void;
}

export default function SendRequestSection({ onSendRequest }: Props) {
    return (
        <div className="flex gap-3">
            <button onClick={onSendRequest} className="my-btn flex-1 py-3 group">
                <Send size={15} className="group-hover:scale-110 transition-transform" />
                Send Request
            </button>
        </div>
    );
}