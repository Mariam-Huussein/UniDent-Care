// ─────────────────────────────────────────────
// Dental AI Agent API — Service Layer
// ─────────────────────────────────────────────
// Calls the external Dental AI Agent (POST /chat, GET /diagnosis)

const AI_BASE_URL = (
  process.env.NEXT_PUBLIC_DENTAL_AI_URL || "https://omarhany-chat-ai-dental.hf.space"
).replace(/\/$/, "");

// ── Types ────────────────────────────────────
export interface ChatMessage {
  role: string; // "user" | "assistant"
  content: string;
}

export interface ChatRequest {
  history: ChatMessage[];
}

// ── POST /chat ───────────────────────────────
export const chatWithAI = async (
  history: ChatMessage[]
): Promise<any> => {
  const res = await fetch(`${AI_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history } satisfies ChatRequest),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(
      errBody?.detail?.[0]?.msg || errBody?.message || `Chat request failed (${res.status})`
    );
  }

  // The API response schema is open — we extract the text content
  const data = await res.json();

  // Handle various possible response shapes
  if (data && typeof data === "object") {
    return data;
  }

  // Fallback
  return data;
};

// ── GET /diagnosis ───────────────────────────
export const getDiagnosis = async (): Promise<any> => {
  const res = await fetch(`${AI_BASE_URL}/diagnosis`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to get diagnosis (${res.status})`);
  }

  return res.json();
};
