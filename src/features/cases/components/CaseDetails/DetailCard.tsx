import { motion } from "framer-motion";

export default function DetailCard({ label, value }: { label: string; value: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            className="bg-gray-50/70 border border-gray-100/50 rounded-xl px-4 py-3 hover:bg-gray-50 hover:border-gray-200/60 transition-all duration-200"
        >
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
        </motion.div>
    );
}
