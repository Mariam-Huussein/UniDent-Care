import api from "@/utils/api";

export const startConversation = async (): Promise<string> => {
    const response = await api.post('/Chat/start');
    // بناءً على الـ response اللي بعته، بنطلع الـ id من الـ conversationId
    return response.data?.data?.conversationId || response.data?.conversationId;
};

export const saveMessage = async (conversationId: string, content: string, isAiMessage: boolean): Promise<void> => {
    await api.post('/Chat/message', {
        conversationId, // يتم إرساله هنا بداخل الـ body
        content,
        isAiMessage
    });
};
