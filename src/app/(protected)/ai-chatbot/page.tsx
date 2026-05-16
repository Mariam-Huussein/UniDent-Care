"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Loader2, Bot, User, Paperclip, CheckCircle2, X, Sparkles, Stethoscope, RefreshCcw, ArrowLeft
} from "lucide-react";
import { RootState } from "@/store";
import { createCaseAi, createDiagnosisAi } from "@/features/cases/services/caseService";
import { getCaseTypes } from "@/server/caseTypes.action";
import { chatWithAI, getDiagnosis, ChatMessage } from "@/features/cases/services/aiChatService";
import { startConversation, saveMessage } from "@/features/cases/services/chatHistoryService";
import Cookies from "js-cookie";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Localized { en: string; ar: string; }

interface DisplayMessage {
  id: string;
  sender: "bot" | "user";
  content: string;
  isDiagnosis?: boolean;
  canRetry?: boolean;
  isEndConversationBtn?: boolean;
  diagnosisData?: any;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function AddCaseChatbot() {
  const patientId = useSelector((s: RootState) => s.auth.user?.publicId) || Cookies.get("user_id") || "";
  const userRole = Cookies.get("user_role") || "user";
  const { language } = useLanguage();
  const isRtl = language === "ar";
  const router = useRouter();

  const tUI = {
    title:       { en: "AI Case Assistant", ar: "مساعد الحالات الذكي" },
    desc:        { en: "Smart interactive case creation", ar: "إنشاء حالة تفاعلي ذكي" },
    submitting:  { en: "Submitting your case...", ar: "جاري إرسال الحالة..." },
    success:     { en: "Case submitted successfully!", ar: "تم إرسال الحالة بنجاح!" },
    error:       { en: "Something went wrong. Please try again.", ar: "حدث خطأ. يرجى المحاولة مرة أخرى." },
    retry:       { en: "Retry", ar: "إعادة المحاولة" },
    redirecting: { en: "Redirecting...", ar: "جاري التحويل..." },
    placeholder: { en: "Describe your dental symptoms...", ar: "صف أعراض أسنانك..." },
    send:        { en: "Send", ar: "إرسال" },
    diagTitle:   { en: "AI Diagnosis Result", ar: "نتيجة التشخيص الذكي" },
    attachPhotos:{ en: "Attach Photos", ar: "إرفاق صور" },
    skip:        { en: "Skip", ar: "تخطي" },
    createCase:  { en: "Create Case", ar: "إنشاء حالة" },
    endConv:     { en: "End Conversation", ar: "إنهاء المحادثة" },
    endingConv:  { en: "Ending...", ar: "جاري الإنهاء..." },
  };
  const t = (obj: Localized) => obj[language as keyof Localized];

  // ── State ──────────────────────────────────
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState<any>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [collectingImages, setCollectingImages] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Bootstrap: send empty history to get first AI message ──
  useEffect(() => {
    const init = async () => {
      if (initialized.current) return;
      initialized.current = true;
      setIsTyping(true);
      try {
        const convId = await startConversation();
        setConversationId(convId);

        const initMsg = "أهلاً، أريد استشارة طبية بخصوص أسناني";
        await saveMessage(convId, initMsg, false);

        const initHistory: ChatMessage[] = [{ role: "USER", content: initMsg }];
        const firstMsgObj = await chatWithAI(initHistory);
        const firstMsgText = typeof firstMsgObj === "string" ? firstMsgObj : (firstMsgObj.reply || JSON.stringify(firstMsgObj));
        
        await saveMessage(convId, firstMsgText, true);

        const history: ChatMessage[] = [...initHistory, { role: "MODEL", content: firstMsgText }];
        setChatHistory(history);
        setMessages([{ id: "init", sender: "bot", content: firstMsgText }]);
      } catch (err: any) {
        console.error("AI init error", err);
        toast.error(t(tUI.error));
      } finally {
        setIsTyping(false);
      }
    };
    init();
  }, []);

  // ── Send user message ─────────────────────
  const handleSend = async (retryText?: string) => {
    const isRetry = typeof retryText === 'string';
    const textToSend = isRetry ? retryText : inputText.trim();
    console.log("handleSend triggered with:", { textToSend, retryText, isTyping, isSubmitting, completed });
    
    if ((!isRetry && !textToSend) || isTyping || isSubmitting || completed) {
      console.log("handleSend returned early due to condition");
      return;
    }
    
    // Prepare history for AI
    let historyForAI: ChatMessage[] = [...chatHistory];
    
    if (isRetry) {
      // If it's a retry, we use the history as it was BEFORE the failure
      // (The failure bot message is usually the last one, we remove it to retry the user message)
      if (historyForAI.length > 0 && historyForAI[historyForAI.length - 1].role === "MODEL") {
        historyForAI.pop();
      }
    } else {
      // Normal send: update display and history
      setInputText("");
      setMessages(prev => [...prev, { id: Date.now() + "_u", sender: "user", content: textToSend }]);
      
      const userMsg: ChatMessage = { role: "USER", content: textToSend };
      historyForAI.push(userMsg);
      setChatHistory(historyForAI);
      
      if (conversationId) {
        saveMessage(conversationId, textToSend, false).catch(err => console.error("Failed to save user msg:", err));
      }
    }

    // Call AI
    console.log("Calling AI with history:", historyForAI);
    setIsTyping(true);
    try {
      const aiResponse = await chatWithAI(historyForAI);
      
      let responseString = "";
      let isCompleted = false;
      let aiDiagnosis = null;
      let shouldCollectImages = false;

      if (typeof aiResponse === "string") {
        responseString = aiResponse;
      } else if (aiResponse && typeof aiResponse === "object") {
        responseString = aiResponse.reply || JSON.stringify(aiResponse);
        if (aiResponse.diagnosis_status === "completed" && aiResponse.show_side_panel) {
          isCompleted = true;
          aiDiagnosis = aiResponse.diagnosis;
        } else if (aiResponse.diagnosis && Array.isArray(aiResponse.diagnosis) && aiResponse.diagnosis.length > 0) {
          aiDiagnosis = aiResponse.diagnosis;
          shouldCollectImages = true;
          setDiagnosisData(aiDiagnosis);
          setCollectingImages(true);
        }
      }

      console.log("AI Response received:", responseString);
      
      const isServerBusy = responseString.includes("ضغط") || 
                           responseString.includes("السيرفر") || 
                           responseString.includes("دقيقة");

      const updatedHistory: ChatMessage[] = [...historyForAI, { role: "MODEL", content: responseString }];
      setChatHistory(updatedHistory);
      
      if (conversationId && !isServerBusy && responseString) {
        saveMessage(conversationId, responseString, true).catch(err => console.error("Failed to save AI msg:", err));
      }
      
      setMessages(prev => {
        let newMessages = [...prev];
        if (isRetry && prev.length > 0 && prev[prev.length - 1].sender === "bot") {
          newMessages[newMessages.length - 1] = {
            id: Date.now() + "_b",
            sender: "bot",
            content: responseString,
            canRetry: isServerBusy,
            isEndConversationBtn: isCompleted,
            diagnosisData: aiDiagnosis
          };
        } else {
          newMessages.push({ 
            id: Date.now() + "_b", 
            sender: "bot", 
            content: responseString,
            canRetry: isServerBusy,
            isEndConversationBtn: isCompleted,
            diagnosisData: aiDiagnosis
          });
        }
        
        if (shouldCollectImages) {
          newMessages.push({
            id: Date.now() + "_img",
            sender: "bot",
            content: isRtl ? "من فضلك ارسل صور الاسنان" : "Please send pictures of the teeth",
          });
        }

        return newMessages;
      });
    } catch (err: any) {
      toast.error(err.message || t(tUI.error));
    } finally {
      setIsTyping(false);
    }
  };

  // ── Get diagnosis ─────────────────────────
  const handleGetDiagnosis = async () => {
    if (isTyping || isSubmitting || completed) return;
    setIsTyping(true);
    try {
      const diagnosis = await getDiagnosis();
      setDiagnosisData(diagnosis);
      setShowDiagnosis(true);

      // Format diagnosis for display
      const diagText = typeof diagnosis === "string"
        ? diagnosis
        : JSON.stringify(diagnosis, null, 2);

      setMessages(prev => [...prev, {
        id: Date.now() + "_diag",
        sender: "bot",
        content: diagText,
        isDiagnosis: true,
      }]);

      if (conversationId) {
        saveMessage(conversationId, diagText, true).catch(err => console.error("Failed to save diagnosis msg:", err));
      }

      // Move to image collection phase
      setCollectingImages(true);
    } catch (err: any) {
      toast.error(err.message || t(tUI.error));
    } finally {
      setIsTyping(false);
    }
  };

  // ── Submit case ───────────────────────────
  const handleCreateCase = async () => {
    if (isSubmitting || completed) return;
    setIsSubmitting(true);
    try {
      const description = chatHistory
        .filter(m => m.role === "USER")
        .map(m => m.content)
        .join("\n");

      // Use publicId from the first diagnosis item returned by AI as the case type
      const firstDiagCaseTypeId = Array.isArray(diagnosisData) && diagnosisData.length > 0
        ? (diagnosisData[0].publicId || "")
        : "";

      const title = isRtl ? "حالة جديدة" : "New Case";

      const caseRes = await createCaseAi({
        PatientId: patientId,
        Title: title,
        Description: description,
        CaseTypeId: firstDiagCaseTypeId,
        IsPublic: false,
        CreatedById: patientId,
        CreatedByRole: userRole,
        Images: files.length > 0 ? files : undefined,
      });

      console.log("Case created:", caseRes.data);
      const newCaseId = caseRes.data?.data || caseRes.data;

      // Create Diagnoses — use publicId from each AI diagnosis item directly
      if (diagnosisData && Array.isArray(diagnosisData)) {
        for (const diag of diagnosisData) {
          const diagCaseTypeId = diag.publicId || firstDiagCaseTypeId;

          await createDiagnosisAi({
             patientCaseId: newCaseId,
             stage: 0,
             caseTypeId: diagCaseTypeId,
             notes: diag.note || diag.description,
             createdById: patientId,
             role: userRole,
             teethNumbers: diag.tooth_number
          });
        }
      }

      setCompleted(true);
      setMessages(prev => [...prev, {
        id: "final",
        sender: "bot",
        content: t(tUI.success),
      }]);
      toast.success(t(tUI.success));
      setTimeout(() => router.push("/my-cases"), 2000);
    } catch (err: any) {
      toast.error(err.message || t(tUI.error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── End Conversation & Create Case + Diagnosis ──
  const handleEndConversation = async (diagnosisArray: any[]) => {
    if (isSubmitting || completed) return;
    setIsSubmitting(true);
    try {
      const description = chatHistory
        .filter(m => m.role === "USER")
        .map(m => m.content)
        .join("\n");

      // Use publicId from the first AI diagnosis item as the case type — no getCaseTypes call needed
      const firstDiagCaseTypeId = Array.isArray(diagnosisArray) && diagnosisArray.length > 0
        ? (diagnosisArray[0].publicId || "")
        : "";

      const title = isRtl ? "حالة جديدة" : "New Case";

      // 1. Create Case
      const caseRes = await createCaseAi({
        PatientId: patientId,
        Title: title,
        Description: description,
        CaseTypeId: firstDiagCaseTypeId,
        IsPublic: false,
        CreatedById: patientId,
        CreatedByRole: userRole,
      });

      const newCaseId = caseRes.data?.data || caseRes.data;

      // 2. Create Diagnoses — use publicId from each AI diagnosis item directly
      if (diagnosisArray && Array.isArray(diagnosisArray)) {
        for (const diag of diagnosisArray) {
          const diagCaseTypeId = diag.publicId || firstDiagCaseTypeId;

          await createDiagnosisAi({
             patientCaseId: newCaseId,
             stage: 0,
             caseTypeId: diagCaseTypeId,
             notes: diag.note || diag.description,
             createdById: patientId,
             role: userRole,
             teethNumbers: diag.tooth_number
          });
        }
      }

      setCompleted(true);
      setMessages(prev => [...prev, {
        id: "final",
        sender: "bot",
        content: t(tUI.success),
      }]);
      toast.success(t(tUI.success));
      setTimeout(() => router.push("/my-cases"), 2000);
    } catch (err: any) {
      toast.error(err.message || t(tUI.error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Computed ───────────────────────────────
  const canChat = !isTyping && !isSubmitting && !completed && !collectingImages;

  // ── Render ─────────────────────────────────
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden transition-colors duration-300 py-2 sm:py-6 h-[calc(100vh-9.5rem)] lg:h-[calc(100vh-14rem)]" dir={isRtl ? "rtl" : "ltr"}>
      {/* Background blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Chat container */}
      <div className="relative w-full max-w-2xl h-full flex flex-col bg-white/80 dark:bg-slate-900/80 rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/40 dark:border-slate-800/60 backdrop-blur-xl overflow-hidden">

        {/* Header */}
        <div className="flex-none p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} className={isRtl ? "rotate-180" : ""} />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Bot size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t(tUI.title)}</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t(tUI.desc)}</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 hide-scrollbar">
          <style dangerouslySetInnerHTML={{ __html: `.hide-scrollbar::-webkit-scrollbar { display: none; }.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }` }} />

          {messages.map((msg, idx) => (
            <motion.div key={msg.id + idx} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-auto ${msg.sender === "user" ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300" : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"}`}>
                  {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                {/* Bubble */}
                <div className={`p-4 rounded-2xl ${
                  msg.isDiagnosis
                    ? "bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800 shadow-md"
                    : msg.sender === "user"
                      ? "bg-slate-800 dark:bg-indigo-600 text-white rounded-br-sm shadow-md"
                      : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-200 rounded-bl-sm"
                }`}>
                  {msg.isDiagnosis && (
                    <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400">
                      <Sparkles size={16} />
                      <span className="font-bold text-sm">{t(tUI.diagTitle)}</span>
                    </div>
                  )}
                  <div className={`text-sm sm:text-[15px] font-medium leading-relaxed whitespace-pre-wrap ${msg.isDiagnosis ? "text-emerald-800 dark:text-emerald-200" : ""}`}>
                    {msg.content}
                  </div>

                  {(msg.canRetry || msg.content.includes("ضغط") || msg.content.includes("السيرفر")) && (
                    <button
                      onClick={() => {
                        console.log("Attempting retry. History:", chatHistory, "Messages:", messages);
                        
                        // 1. Try to find in chatHistory
                        let msgToRetry = [...chatHistory]
                          .reverse()
                          .find(h => h.role?.toUpperCase() === "USER" && h.content?.trim())?.content;
                        
                        // 2. Fallback to messages state if history is empty
                        if (!msgToRetry) {
                          msgToRetry = [...messages]
                            .reverse()
                            .find(m => m.sender === "user" && m.content?.trim())?.content;
                        }

                        // 3. Fallback to current input if nothing else found
                        if (!msgToRetry) {
                          msgToRetry = inputText.trim();
                        }

                        console.log("Final message selected for retry:", msgToRetry);
                        
                        if (msgToRetry) {
                          setIsTyping(false);
                          setTimeout(() => handleSend(msgToRetry), 50);
                        } else {
                          console.log("No message found to retry, sending empty string as fallback.");
                          setIsTyping(false);
                          setTimeout(() => handleSend(""), 50);
                        }
                      }}
                      className="mt-3 flex items-center gap-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95"
                    >
                      <RefreshCcw size={14} /> 
                      {t(tUI.retry)}
                    </button>
                  )}

                  {msg.isEndConversationBtn && !completed && (
                    <button
                      onClick={() => handleEndConversation(msg.diagnosisData)}
                      disabled={isSubmitting}
                      className="mt-3 flex items-center gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} 
                      {isSubmitting ? t(tUI.endingConv) : t(tUI.endConv)}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 max-w-[85%] flex-row">
                <div className="w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-auto bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"><Bot size={16} /></div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-slate-400 flex items-center gap-1.5 rounded-bl-sm h-13">
                  <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
                  <motion.div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Submitting indicator */}
          {isSubmitting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center my-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-bold text-sm border border-indigo-100 dark:border-indigo-800"><Loader2 size={18} className="animate-spin" /> {t(tUI.submitting)}</div>
            </motion.div>
          )}

          {/* Completed indicator */}
          {completed && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full font-bold text-sm border border-emerald-100 dark:border-emerald-800"><CheckCircle2 size={18} /> {t(tUI.redirecting)}</div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input area */}
        <div className="flex-none p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900">
          <AnimatePresence mode="wait">
            {/* Image collection after diagnosis */}
            {collectingImages && !completed && !isSubmitting && (
              <motion.div key="img-input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col gap-3">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <label className="flex-1 flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl px-5 py-3.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-colors text-slate-600 dark:text-slate-400 font-bold text-sm">
                    <Paperclip size={18} /><span>{t(tUI.attachPhotos)} ({files.length})</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => { if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]); }} />
                  </label>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={handleCreateCase} className="px-6 h-13 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-bold text-sm">
                      {t(tUI.createCase)} <Send size={16} className={isRtl ? "rotate-180" : ""} />
                    </button>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <span className="truncate max-w-24">{file.name}</span>
                        <button onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Normal chat input */}
            {canChat && (
              <motion.form key="text-input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t(tUI.placeholder)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3.5 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/50"
                  autoFocus
                />
                <button type="submit" disabled={!inputText.trim()} className="w-14 h-13 flex shrink-0 items-center justify-center bg-indigo-600 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 hover:bg-indigo-700 text-white rounded-xl transition-colors">
                  <Send size={18} className={isRtl ? "rotate-180 -ml-1" : "ml-1"} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
