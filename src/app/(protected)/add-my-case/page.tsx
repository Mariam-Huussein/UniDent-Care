"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { 
    MessageSquare, Plus, Search, Bot, Calendar, Clock, ChevronRight, 
    MessageCircle, Sparkles, Loader2, User, ArrowLeft 
} from "lucide-react";
import Link from "next/link";
import { getConversations, getConversationDetails } from "@/features/cases/services/chatHistoryService";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Conversation {
    id: string;
    lastMessage: string;
    createdAt: string;
    patientId: string;
}

interface ConversationDetail {
    id: string;
    messages: {
        sender: string;
        content: string;
        createdAt: string;
    }[];
}

export default function MyConsultations() {
    const patientId = useSelector((state: RootState) => state.auth.user?.publicId) || Cookies.get("user_id") || "";
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedConv, setSelectedConv] = useState<ConversationDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        const fetchConvs = async () => {
            try {
                const res = await getConversations();
                console.log("Conversations response:", res);
                // Handle different response structures
                const data = res.data || res;
                setConversations(Array.isArray(data) ? data : (data.items || []));
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConvs();
    }, []);

    const handleViewDetails = async (id: string) => {
        setDetailLoading(true);
        try {
            const res = await getConversationDetails(id);
            console.log("Conversation details response:", res);
            const data = res.data || res;
            // If data is an array, it's the messages list directly
            if (Array.isArray(data)) {
                setSelectedConv({ id, messages: data });
            } else {
                setSelectedConv(data);
            }
        } catch (err) {
            console.error("Failed to fetch conversation details", err);
        } finally {
            setDetailLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-6 sm:px-6 lg:px-10 lg:py-10 transition-colors duration-300" dir={isRtl ? "rtl" : "ltr"}>
            {/* Header Section */}
            <div className="relative rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none p-6 sm:p-8 mb-8 overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 rounded-full bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-500/10 dark:to-blue-500/10 blur-3xl opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 rounded-full bg-linear-to-tr from-violet-50 to-purple-100 dark:from-violet-500/10 dark:to-purple-500/10 blur-3xl opacity-60 pointer-events-none" />
                
                <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-600/25 text-white">
                            <Bot size={28} strokeWidth={2.2} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                {isRtl ? "استشاراتي الذكية" : "AI Consultations"}
                            </h1>
                            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                {isRtl ? "تاريخ محادثاتك مع المساعد الذكي" : "Your interaction history with the AI assistant"}
                            </p>
                        </div>
                    </div>

                    <Link 
                        href="/ai-chatbot"
                        className="relative overflow-hidden px-6 py-3 bg-linear-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 group shrink-0"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                        <Plus size={18} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-bold text-sm tracking-tight">{isRtl ? "استشارة جديدة" : "New Consultation"}</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                    {selectedConv ? (
                        <motion.div 
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                        >
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <button 
                                    onClick={() => setSelectedConv(null)}
                                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors flex items-center gap-2"
                                >
                                    <ArrowLeft size={20} className={isRtl ? "rotate-180" : ""} />
                                    <span className="font-bold text-sm">{isRtl ? "العودة للقائمة" : "Back to list"}</span>
                                </button>
                                <h3 className="font-bold text-slate-800 dark:text-white">
                                    {isRtl ? "تفاصيل الاستشارة" : "Consultation Details"}
                                </h3>
                                <div className="w-10" />
                            </div>
                            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto bg-slate-50/30 dark:bg-transparent">
                                {selectedConv && (selectedConv as any).messages?.map((m: any, idx: number) => (
                                    <div key={idx} className={`flex ${m.sender === "User" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                                            m.sender === "User" 
                                                ? "bg-indigo-600 text-white rounded-tr-none" 
                                                : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none"
                                        }`}>
                                            <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                                            <span className={`text-[10px] mt-2 block opacity-60 ${m.sender === "User" ? "text-right" : "text-left"}`}>
                                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-48 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 animate-pulse" />
                                ))
                            ) : conversations.length > 0 ? (
                                conversations.map((conv) => (
                                    <motion.div 
                                        key={conv.id}
                                        whileHover={{ y: -4 }}
                                        className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => handleViewDetails(conv.id)}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                    <MessageCircle size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-white">
                                                        {isRtl ? "استشارة ذكية" : "Smart Consultation"}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                                        <Calendar size={12} />
                                                        <span>{new Date(conv.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                                {isRtl ? "مكتمل" : "Completed"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <Clock size={12} />
                                                <span>{new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-xs group-hover:gap-2 transition-all">
                                                {isRtl ? "عرض التفاصيل" : "View Details"}
                                                <ChevronRight size={14} className={isRtl ? "rotate-180" : ""} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                                        <MessageSquare size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                                        {isRtl ? "لا توجد استشارات بعد" : "No consultations yet"}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                                        {isRtl ? "ابدأ أول استشارة لك الآن للحصول على تشخيص ذكي لحالتك" : "Start your first consultation now to get an AI diagnosis for your condition"}
                                    </p>
                                    <Link 
                                        href="/ai-chatbot"
                                        className="relative overflow-hidden px-10 py-4 bg-linear-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/25 transition-all active:scale-95 group"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                                        <span className="relative z-10">{isRtl ? "ابدأ استشارتك الأولى الآن" : "Start Your First Consultation"}</span>
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {detailLoading && (
                <div className="fixed inset-0 z-[2000] bg-slate-950/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
                        <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                        <p className="font-bold text-slate-800 dark:text-white">
                            {isRtl ? "جاري تحميل التفاصيل..." : "Loading details..."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
